let idMostrar = 0;
let titulosEvento = [
    "# de Registro", "Tipo de Evento", "Categoría", "Rama", "Inicio", "Termino", "Cantidad de Horas",
    "Modalidad", "Público Atendido", "Origen de los Ponentes", "Costo del Evento", "Forma de Pago",
    "# de Hombres", "# de Mujeres", "# de Expositores"
];

$
let estatusEvento = 0;

function actionRead(){
  
  //Checar sesion
    var nombreUsuario = sessionStorage.getItem("data");//Obtenemos el valor del session storage
    if(nombreUsuario != null){
      if(sessionStorage.getItem("admin") == "Si"){
        $("#nombreUsuario").text("Bienvenido "+nombreUsuario);
      }else if(sessionStorage.getItem("editorMemInst") == "Si"){
        quitarLinks('linkAltaCategoria');
        quitarLinks('linkAltaTipoEvento');
        quitarLinks('linkAltaUsuarios');
        quitarLinks('linkResumenEducacion');
        $("#nombreUsuario").text("Bienvenido "+nombreUsuario);
      }else{
        Swal.fire({
          showConfirmButton: false,
          allowOutsideClick : false, 
          icon : 'error',
          title: 'No tiene permiso para ingresar. Será redireccionado'
        })
        setTimeout(() => {
          window.location.replace("Calendario.html"); 
        }, 2000);
        clearTimeout();
      }
    }else{
      Swal.fire({
        showConfirmButton: false,
        allowOutsideClick : false,
        icon : 'error',
        title: 'Su sesión ha expirado. Inicie de nuevo su sesión'
      })
      setTimeout(() => {
        window.location.replace("login.html");
      }, 2000);
      clearTimeout();
    }
  //Checar sesion

      $.ajax({
        method : "post",
        url: "php/eventosMemoria.php",
        data: {
          action : "read",
        },
        success: function( result ) {
            let resultJSON = JSON.parse(result);
            if(resultJSON.estatus == 1){


                let tablaDatos = $("#tablaDatosEvento").DataTable();

                    resultJSON.eventos.forEach(evento => {

                        let botonMostrar = '<button class = "btn btn-info" id="botonEditar'+evento.id+'" onclick="actionObtenerDatos('+evento.id+');">Editar</button>';
                        let estatusEvento = "";

                        if(evento.liberado == 1){
                            estatusEvento = "Liberado";
                        }else{
                            estatusEvento = "No Liberado";
                        }
                            tablaDatos.row.add([
                                evento.nombre,
                                evento.categoria,
                                evento.tipoEvento,
                                evento.anio,
                                estatusEvento,
                                botonMostrar
                            ]).draw().node().id= "row_"+evento.id;
                        
                    });
            }
        }
      }); 
}

function actionObtenerDatos(id){

    idMostrar = id;
    //Ahora buscamos el boton que se presionó para deshabilitarlo mientras se hace la petición
    let nombre = "botonEditar"+idMostrar;

    $("#"+nombre).addClass("disabled");

    $.ajax({
      method : "post",
      url: "php/eventosMemoria.php",
      data: {
        action : "buscarEvento",
        idBuscar : idMostrar
      },
      success: function( result ) {
        //Habilitamos de nuevo el boton
        $("#"+nombre).removeClass("disabled");

        //Convertimos el dato recibido a JSON
        let resultJSON = JSON.parse(result);

        //Obtenemos la direccion de la tabla, y quitamos todos los elementos
        $("#tablaDatosModal tbody tr").remove();

          if(resultJSON.estatus == 1){//En caso de éxito

            //Ahora, modificamos el DOM con los datos obtenidos de la BD
            modificarDOMModal(resultJSON);

          }else{

            alert("Error al buscar el evento!");

          }

      }
    });
}

function modificarDOMModal(resultJSON){
  let indiceArrayNombres = 1;

  for(let indice = 0; resultJSON[0][indice] != undefined; indice++){

      if(titulosEvento[indiceArrayNombres] != undefined){
          $("#tablaDatosModal").find("tbody").append("<tr><td><i><strong>"+titulosEvento[indice]+"</strong></i></td><td style='border-right: 1px solid black;'>"+resultJSON[0][indice]+"</td><td><i><strong>"+titulosEvento[indiceArrayNombres]+"</strong></i></td><td>"+resultJSON[0][indiceArrayNombres]+"</td></tr>");
      }else{
          $("#tablaDatosModal").find("tbody").append("<tr><td colspan='2' style='border-right: 1px solid black;'><i><strong>"+titulosEvento[indice]+"</strong></i></td><td colspan='2'>"+resultJSON[0][indice]+"</td>");
      }
      
      indice++;
      indiceArrayNombres = indiceArrayNombres + 2;
  }

  //Cambiando el DOM del modal
  $("#calloutDescripcion p").html(resultJSON[1].descripcionEvento);

  //Checamos si hay pormenores o no
    if(resultJSON[1].pormenores != ""){
      $("#calloutPorMenores p").html(resultJSON[1].pormenores);
    }else{
      $("#calloutPorMenores p").html("<i>Sin Evidencias</i>");
    }
  //Checando si hay evidencias o no
      if(resultJSON[1].evidenciaUno != ""){//Si hay algo en evidencia 1
        $("#ev1").attr("src","img/"+resultJSON[1].evidenciaUno);
      }else{
        $("#ev1").attr("src","img/noImagen.jpeg");
      }

      if(resultJSON[1].evidenciaDos != ""){//Si hay algo en evidencia 2
        $("#ev2").attr("src","img/"+resultJSON[1].evidenciaDos); 
      }else{
        $("#ev2").attr("src","img/noImagen.jpeg");
      }
  //Modificamos el tituo de el titulo de los eventos
  $("#tituloDelEvento").html("Evento: <i>"+resultJSON[1].nombreEvento+"</i>");

  //Checamos si el evento está liberado o no
    if(resultJSON[1].estatusLiberado == 0){
        $("#labelInfoLiberado").html("<i class='icon fas fa-ban pr-2'></i>Evento NO LIBERADO");
        estatusEvento = 0;       
    }else{
        $("#labelInfoLiberado").html("<i class='icon fas fa-check pr-2'></i>Evento LIBERADO");
        estatusEvento = 1;
    }

  //Checamos si hay edicion de la memoria institucional o no

    if(resultJSON[1].boolEditMemInst == 0){
        $("#labelInfoMemoria").html("<i class='icon fas fa-ban pr-2'></i>Memoria Institucional SIN guardar");
        $(".note-editable.card-block").html("");
    }else{
        $("#labelInfoMemoria").html("<i class='icon fas fa-check pr-2'></i>Memoria Institucional EXISTENTE");
        $(".note-editable.card-block").html(resultJSON[1].EditMemInst);
    }

  //Una vez teniendo todo, mostramos el modal
  $("#modal-info").modal("show");
}

function liberarEvento(){

    $("#btnLiberar").addClass("disabled");//Deshabilitamos el boton mientras esperamos la respuesta del servidor

    $.ajax({
      method : "post",
      url: "php/eventosMemoria.php",
      data: {
        action : "cambiarEstatusLiberar",
        idEvento : idMostrar,
        estatusActual : estatusEvento
      },
      success: function( result ) {

        $("#btnLiberar").removeClass("disabled");//Habilitamos de nuevo el boton

        let resultadoJSON = JSON.parse(result);
        estatusEvento = resultadoJSON.estadoLiberado;
         //Obtenemos el renglon de la tabla para modifcar el valor del estado del evento
        let tablaEvento = $("#tablaDatosEvento").DataTable();
        let renglon = tablaEvento.row("#row_"+idMostrar).data();
            if(estatusEvento == 1){
              $("#labelInfoLiberado").html("<i class='icon fas fa-check pr-2'></i>Evento LIBERADO");
              renglon[4] = "Liberado";
            }else{
              $("#labelInfoLiberado").html("<i class='icon fas fa-ban pr-2'></i>Evento NO LIBERADO");
              renglon[4] = "No Liberado";
            }
        //Actualizamos la tabla
        tablaEvento.row("#row_"+idMostrar).data(renglon);
      }
    });
    
}

function guardarMemoriaInsitucional(){

    //Obtenemos el texto de la memoria institucional
    let memoriaInstitucionalTexto = $(".note-editable.card-block")[0]['innerHTML'];
    $("#btnGuardar").addClass("disabled");//Deshabilitamos el boton mientras esperamos la respuesta del servidor

    
    $.ajax({
      method : "post",
      url: "php/eventosMemoria.php",
      data: {
        action : "agregarEdicionMemoria",
        idEvento : idMostrar,
        texto : memoriaInstitucionalTexto
      },
      success: function( result ) {

        $("#btnGuardar").removeClass("disabled");//Habilitamos de nuevo el boton
        
        let resultJSON = JSON.parse(result);//Convertimos el dato a JSON

          if(resultJSON.accion == "UPDATE"){//Dependiendo lo que hicimos en la BD, modificamos el label

              if(resultJSON.estatus == 1){

                $("#labelInfoMemoria").html("<i class='icon fas fa-check pr-2'></i>Memoria Insitucional GUARDADA");

              }else{

                $("#labelInfoMemoria").html("<i class='icon fas fa-info pr-2'></i>No se hicieron modificaciones a la Memoria");

              }

          }else{

              if(resultJSON.estatus == 1){

                $("#labelInfoMemoria").html("<i class='icon fas fa-check pr-2'></i>Memoria Insitucional GUARDADA");

              }else{

                $("#labelInfoMemoria").html("<i class='icon fas fa-exclamation-triangle pr-2'></i>Error al GUARDAR la Memoria");

              }

          }

      }
    }); 
}

function quitarLinks(idLink){
  $("#"+idLink).remove();
}

function checarCambio(){

  
}