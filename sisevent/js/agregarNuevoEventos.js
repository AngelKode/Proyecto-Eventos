//CRUD DE LA TABLA
let idActualizar = 0;
let idEliminar = 0;
let idEvidencias = 0;
let eventoEditar;
let categoriaEditar;
let cambiarFecha = 1;
function actionRead(){

  //Checar sesion
    var nombreUsuario = sessionStorage.getItem("data");//Obtenemos el valor del session storage
    if(nombreUsuario != null){
      if(sessionStorage.getItem("admin") == "Si"){
        $("#nombreUsuario").text("Bienvenido "+nombreUsuario);
      }else{
        $("#linkAltaCategoria").remove();
        $("#linkAltaTipoEvento").remove();
        $("#linkAltaUsuarios").remove();
        $("#nombreUsuario").text("Bienvenido "+nombreUsuario);
      }
    }else{
      alert("Su sesión ha expirado, inicie de nuevo su sesion!");
      window.location.replace("login.html");
    }
  //Checar sesion
    leerTipoDeEvento();
    leerCategorias();
      $.ajax({
        method : "post",
        url: "php/agregarEventoFecha.php",
        data: {
          action : "read",
          creator : sessionStorage.getItem("data")
        },
        success: function( result ) {
            var resultJSON = JSON.parse(result);//Convertimos el dato JSON

            if(resultJSON.estado == 1){//Si la variable en su posicion estado vale 1, todo salió bien
                  var tabla= $('#example1').DataTable();//Tipo datatable
  
                resultJSON.eventos.forEach(function(datoEvento){//Recorremos cada valor obtenido
                    let fechaInicio = datoEvento.fechaInicio.substring(0,datoEvento.fechaInicio.length-8);
                    let fechaFinal = datoEvento.fechaFinal.substring(0,datoEvento.fechaFinal.length-8);
                    Botones = '<button style = "background : rgb(255,193,7);" type="button" class="btn btn-default" onclick="identificarIdEvidencias('+datoEvento.id+');" id = "botonEvidencia'+datoEvento.id+'">Evidencias</button> | <button type="button" class="btn btn-info"  onclick = "identificarEditar('+datoEvento.id+');" id="botonEditar'+datoEvento.id+'">Actualizar</button> | <button type="button" class="btn btn-danger" onclick = "identificarEliminar('+datoEvento.id+');" id="botonEliminar'+datoEvento.id+'">Eliminar</button>';
                    tabla.row.add([
                        
                        datoEvento.titulo,//Agregamos el nombre a la tabla
                        fechaInicio,//Las observaciones
                        fechaFinal,Botones
                        ]).draw().node().id= "row_"+datoEvento.id;  //Y los botones de Eliminar y editar
  
                });  
              
            }else{
              alert(resultJSON.mensaje);//Si hubo un error, mandamos un mensaje
            }
        }
      });    
}
/*
function checarSesion(){
       $.ajax({
        method : "post",
        url: "php/checarSesion.php",
        data: {
          action : "read"
        },
        success: function( result ) {
  if(result){   
 
    }else{
       window.location.replace("login.html");
    }
  } 
 });             
}
*/
function actionUpdate(){
  let nombreEvento = document.getElementById("eventoEdit").value;
  let descripcionEvento = document.getElementById("descripcionEdit").value;
  let fechaInicio = "";
  let fechaFin = "";

         if($("#edit_reservationtime").data("daterangepicker").startDate.format("A") == "AM" && $("#edit_reservationtime").data("daterangepicker").endDate.format("A") == "AM"){
            let horaInicio = parseInt($("#edit_reservationtime").data("daterangepicker").startDate.format("hh"));
            let horaFin = parseInt($("#edit_reservationtime").data("daterangepicker").endDate.format("hh"));
             if(horaInicio == 12){
                horaInicio = 0;
             }
             if(horaFin == 12){
                horaFin = 0;
             }
            fechaInicio = $("#edit_reservationtime").data("daterangepicker").startDate.format("YYYY-MM-DD "+horaInicio+":mm");
            fechaFin = $("#edit_reservationtime").data("daterangepicker").endDate.format("YYYY-MM-DD "+horaFin+":mm");

         }else if($("#edit_reservationtime").data("daterangepicker").startDate.format("A") == "AM" && $("#edit_reservationtime").data("daterangepicker").endDate.format("A") == "PM"){

            let horaInicio = parseInt($("#edit_reservationtime").data("daterangepicker").startDate.format("hh"));
            let horaFin = parseInt($("#edit_reservationtime").data("daterangepicker").endDate.format("hh"))+12;
              if(horaInicio == 12){
                horaInicio = 0;
              }
              if(horaFin == 24){
                horaFin -= 12;
              }
            fechaInicio = $("#edit_reservationtime").data("daterangepicker").startDate.format("YYYY-MM-DD "+horaInicio+":mm");
            fechaFin = $("#edit_reservationtime").data("daterangepicker").endDate.format("YYYY-MM-DD "+horaFin+":mm");

         }else if($("#edit_reservationtime").data("daterangepicker").startDate.format("A") == "PM" && $("#edit_reservationtime").data("daterangepicker").endDate.format("A") == "AM"){

           let horaInicio = parseInt($("#edit_reservationtime").data("daterangepicker").startDate.format("hh"))+12;
           let horaFin = parseInt($("#edit_reservationtime").data("daterangepicker").endDate.format("hh"));
              if(horaFin == 12){
                horaFin = 0;
              }
              if(horaInicio == 24){
                horaInicio -= 12;
              }
            fechaInicio = $("#edit_reservationtime").data("daterangepicker").startDate.format("YYYY-MM-DD "+horaInicio+":mm");
            fechaFin = $("#edit_reservationtime").data("daterangepicker").endDate.format("YYYY-MM-DD "+horaFin+":mm");
         }else{

            let horaInicio = parseInt($("#edit_reservationtime").data("daterangepicker").startDate.format("hh"))+12;
            let horaFin = parseInt($("#edit_reservationtime").data("daterangepicker").endDate.format("hh"))+12;

              if(horaInicio == 24){
                horaInicio -= 12;
              }
              if(horaFin == 24){
                horaFin -= 12;
              }
            fechaInicio = $("#edit_reservationtime").data("daterangepicker").startDate.format("YYYY-MM-DD "+horaInicio+":mm");
            fechaFin = $("#edit_reservationtime").data("daterangepicker").endDate.format("YYYY-MM-DD "+horaFin+":mm");

         }
  let tipoEvento = document.getElementById("tipoDeEventoEdit").value;
  let publico = document.getElementById("tipoPublicoEdit").value;
  categoriaEditar = document.getElementById('categoriaEdit').value;

   update(nombreEvento,descripcionEvento,fechaInicio,fechaFin,tipoEvento,publico,idActualizar);  
}

function update(nombreEvento,descripcionEvento,fechaInicio,fechaFin,tipoEvento,publico,idActualizar){
   $.ajax({
        method : "post",
        url: "php/agregarEventoFecha.php",
        data: {
          action : "update",
          nombreUp : nombreEvento,
          descripcionUp : descripcionEvento,
          fechaInicioUp : fechaInicio,
          fechaFinUp : fechaFin,
          tipoEventoUp : tipoEvento,
          tipoPublicoUp : publico,
          categoriaUp : categoriaEditar,
          idEdit : idActualizar
        },
        success: function( result ) {
            var resultJSON = JSON.parse(result);//Convertimos el dato JSON
            if(resultJSON.estado == 1){//Si la variable en su posicion estado vale 1, todo salió bien

                let tabla = $("#example1").DataTable();
                let renglon = tabla.row("#row_"+idActualizar).data();
                renglon[0] = nombreEvento;
                renglon[1] = fechaInicio.substring(0,fechaInicio.length-5);
                renglon[2] = fechaFin.substring(0,fechaFin.length-5);

                tabla.row("#row_"+idActualizar).data(renglon);
                $(function() {
                     const Toast = Swal.mixin({
                       toast: true,
                       position: 'top-end',
                       showConfirmButton: false,
                       timer: 3000
                     });
                    Toast.fire({
                        type: 'success',
                        title: 'El evento ha sido actualizado exitósamente!'
                      })
                   });
            }else{
              $(function() {
                     const Toast = Swal.mixin({
                       toast: true,
                       position: 'top-end',
                       showConfirmButton: false,
                       timer: 3000
                     });
                    Toast.fire({
                        type: 'info',
                        title: 'No se hicieron modificaciones al evento!'
                      })
                   });
            }
        }
      });
}
function actionDelete(){
 $.ajax({
        method : "post",
        url: "php/agregarEventoFecha.php",
        data: {
          action : "delete",
          idEliminar : idEliminar
        },
        success: function( result ) {

        var resultJSON = JSON.parse(result);//Convertimos el dato JSON
            if(resultJSON.estatus == 1){//Si la variable en su posicion estado vale 1, todo salió bien  
                let tabla = $("#example1").DataTable();
                tabla.row("#row_"+idEliminar).remove().draw();
                $(function() {
                     const Toast = Swal.mixin({
                       toast: true,
                       position: 'top-end',
                       showConfirmButton: false,
                       timer: 3000
                     });
                    Toast.fire({
                        type: 'success',
                        title: 'El evento ha sido eliminado exitósamente!'
                      })
                   });
             }else{
                $(function() {
                     const Toast = Swal.mixin({
                       toast: true,
                       position: 'top-end',
                       showConfirmButton: false,
                       timer: 3000
                     });
                    Toast.fire({
                        type: 'error',
                        title: 'Error al eliminar el evento!'
                      })
                   });
             }
            }
      }); 
    }
function leerTipoDeEvento(){//Leemos los datos de la tabla d tipo de evento para poner los datos en el select
  $.ajax({
        method : "post",
        url: "php/obtenerTipoEvento.php",
        data: {
          action : "read"
        },
        success: function( result ) {

        var resultJSON = JSON.parse(result);//Convertimos el dato JSON

            if(resultJSON.estado == 1){//Si la variable en su posicion estado vale 1, todo salió bien  
                resultJSON.tipos_eventos.forEach(function(tipo_evento){//Recorremos cada valor obtenido
                    let select = document.getElementById('tipoDeEvento');   
                    let option = document.createElement('option');
                    option.text = tipo_evento.nombre;
                    select.appendChild(option);
                });
                
            }else
              alert(resultJSON.mensaje);//Si hubo un error, mandamos un mensaje
        }
  });
}
function leerCategorias(){//Obtenemos las categorias que se han dado de alta

  $.ajax({
    method : "post",
    url: "php/obtenerCategorias.php",
    data: {
      action : "read"
    },
    success: function( result ) {

    var resultJSON = JSON.parse(result);//Convertimos el dato JSON

        if(resultJSON.estado == 1){//Si la variable en su posicion estado vale 1, todo salió bien  
            resultJSON.categorias.forEach(function(categoria){//Recorremos cada valor obtenido
                let select = document.getElementById('tipoCategoria');   
                let option = document.createElement('option');
                option.text = categoria.nombre;
                select.appendChild(option);
            });
            
        }else
          alert(resultJSON.mensaje);//Si hubo un error, mandamos un mensaje
    }
  });

}
function actionCreate(){

  let nombreEvento = document.getElementById("eventoNuevo").value;
  let descripcionEvento = document.getElementById("descripcionEvento").value;
  let fechaInicio = "";
  let fechaFin = "";

         if($("#reservationtime").data("daterangepicker").startDate.format("A") == "AM" && $("#reservationtime").data("daterangepicker").endDate.format("A") == "AM"){
            let horaInicio = parseInt($("#reservationtime").data("daterangepicker").startDate.format("hh"));
            let horaFin = parseInt($("#reservationtime").data("daterangepicker").endDate.format("hh"));
             if(horaInicio == 12){
                horaInicio = 0;
             }
             if(horaFin == 12){
                horaFin = 0;
             }
            fechaInicio = $("#reservationtime").data("daterangepicker").startDate.format("YYYY-MM-DD "+horaInicio+":mm");
            fechaFin = $("#reservationtime").data("daterangepicker").endDate.format("YYYY-MM-DD "+horaFin+":mm");

         }else if($("#reservationtime").data("daterangepicker").startDate.format("A") == "AM" && $("#reservationtime").data("daterangepicker").endDate.format("A") == "PM"){

            let horaInicio = parseInt($("#reservationtime").data("daterangepicker").startDate.format("hh"));
            let horaFin = parseInt($("#reservationtime").data("daterangepicker").endDate.format("hh"))+12;
              if(horaInicio == 12){
                horaInicio = 0;
              }
              if(horaFin == 24){
                horaFin -= 12;
              }
            fechaInicio = $("#reservationtime").data("daterangepicker").startDate.format("YYYY-MM-DD "+horaInicio+":mm");
            fechaFin = $("#reservationtime").data("daterangepicker").endDate.format("YYYY-MM-DD "+horaFin+":mm");

         }else if($("#reservationtime").data("daterangepicker").startDate.format("A") == "PM" && $("#reservationtime").data("daterangepicker").endDate.format("A") == "AM"){

           let horaInicio = parseInt($("#reservationtime").data("daterangepicker").startDate.format("hh"))+12;
           let horaFin = parseInt($("#reservationtime").data("daterangepicker").endDate.format("hh"));
              if(horaFin == 12){
                horaFin = 0;
              }
              if(horaInicio == 24){
                horaInicio -= 12;
              }
            fechaInicio = $("#reservationtime").data("daterangepicker").startDate.format("YYYY-MM-DD "+horaInicio+":mm");
            fechaFin = $("#reservationtime").data("daterangepicker").endDate.format("YYYY-MM-DD "+horaFin+":mm");
         }else{

            let horaInicio = parseInt($("#reservationtime").data("daterangepicker").startDate.format("hh"))+12;
            let horaFin = parseInt($("#reservationtime").data("daterangepicker").endDate.format("hh"))+12;

              if(horaInicio == 24){
                horaInicio -= 12;
              }
              if(horaFin == 24){
                horaFin -= 12;
              }
            fechaInicio = $("#reservationtime").data("daterangepicker").startDate.format("YYYY-MM-DD "+horaInicio+":mm");
            fechaFin = $("#reservationtime").data("daterangepicker").endDate.format("YYYY-MM-DD "+horaFin+":mm");
         }
  let tipoEvento = document.getElementById("tipoDeEvento").value;
  let publico = document.getElementById("tipoPublico").value;

  if(nombreEvento == "" || descripcionEvento == "" || tipoEvento == "" || publico == ""){
     toastr.error('Faltan campos! Verifiquelos');
     toastr.info('No se pudo guardar el evento');
  }else{
        
        agregar(nombreEvento,descripcionEvento,fechaInicio,fechaFin,tipoEvento,publico);
      
    }
} 
function agregar(nombreEvento,descripcionEvento,fechaInicio,fechaFin,tipoEvento
  ,publico){
  $.ajax({
        method : "post",
        url: "php/agregarEventoFecha.php",
        data: {
          action : "create",
          nombre : nombreEvento,
          descripcion : descripcionEvento,
          fechaInicio : fechaInicio,
          fechaFin : fechaFin,
          tipoEvento : tipoEvento,
          publico : publico,
          creator : sessionStorage.getItem("data")
        },
        success: function( result ) {
            var resultJSON = JSON.parse(result);//Convertimos el dato JSON
            if(resultJSON.estatus == 1){//Si la variable en su posicion estado vale 1, todo salió bien
                 var tabla= $('#example1').DataTable();//Tipo datatable       

                 //Botones de evidencias, editar y eliminar
                 Botones = '<button style = "background : rgb(255,193,7);" type="button" class="btn btn-default" onclick="identificarIdEvidencias('+resultJSON.ultimoId+');" id = "botonEvidencia'+resultJSON.ultimoId+'">Evidencias</button> | <button type="button" class="btn btn-info"  onclick = "identificarEditar('+resultJSON.ultimoId+');" id="botonEditar'+resultJSON.ultimoId+'">Actualizar</button> | <button type="button" class="btn btn-danger" onclick = "identificarEliminar('+resultJSON.ultimoId+');" id="botonEliminar'+resultJSON.ultimoId+'">Eliminar</button>';
                 //actualizamos la tabla  
                 let nuevaFechaIn = fechaInicio.substring(0,fechaInicio.length-5);
                 let nuevaFechaFin = fechaFin.substring(0,fechaFin.length-5);
                    tabla.row.add([
                        nombreEvento,
                        nuevaFechaIn,
                        nuevaFechaFin,
                        Botones]).draw().node().id= "row_"+resultJSON.ultimoId;//Le asignamos el ID al renglón
                    $(function() {
                     const Toast = Swal.mixin({
                       toast: true,
                       position: 'top-end',
                       showConfirmButton: false,
                       timer: 3000
                     });
                    Toast.fire({
                        type: 'success',
                        title: 'El evento ha sido guardado exitósamente!'
                      });
                   });
                document.getElementById('eventoNuevo').value = "";
                document.getElementById('descripcionEvento').value = "";
            }else{
              $(function(){
                     const Toast = Swal.mixin({
                       toast: true,
                       position: 'top-end',
                       showConfirmButton: false,
                       timer: 3000
                     });
                    Toast.fire({
                        type: 'error',
                        title: 'Error al agregar el evento!'
                      });
                   });
            }

         }
      });
}  
function identificarEliminar(id){
    let boton = document.getElementById('botonEliminar'+id);
    boton.innerHTML = "";
    boton.style.width = "82px";
    let span = document.createElement('span');
    span.setAttribute("class","spinner-border spinner-border-sm mr-2");
    span.setAttribute("role","status");
    span.setAttribute("aria-hidden",true);
    span.setAttribute("id","load");
    span.style.position = "relative";
    span.style.left = "5px";
    boton.appendChild(span);

    idEliminar = id;
    const tabla = $("#example1").DataTable();
    const renglon = tabla.row("#row_"+idEliminar).data();

    const nombre = renglon[0];  
    document.getElementById('eventoEliminar').innerHTML = nombre;
    leerDatosEventoDelete(); 
}

function identificarEditar(id){   
    
    let boton = document.getElementById('botonEditar'+id);
    boton.innerHTML = "";
    boton.style.width = "92.1px";
    let span = document.createElement('span');
    span.setAttribute("class","spinner-border spinner-border-sm mr-2");
    span.setAttribute("role","status");
    span.setAttribute("aria-hidden",true);
    span.setAttribute("id","load");
    span.style.position = "relative";
    span.style.left = "4px";
    boton.appendChild(span);

  
    idActualizar = id;
    const tabla = $("#example1").DataTable();
    const renglon = tabla.row("#row_"+idActualizar).data();

    const nombre = renglon[0];
    document.getElementById("eventoEdit").value = nombre;
    leerDatosEvento();

}

function identificarIdEvidencias(id){
   //Creando la imagen de carga en el boton mientras se cargan los datos 
    let boton = document.getElementById('botonEvidencia'+id);
    boton.innerHTML = "";
    boton.style.width = "97.3px";
    let span = document.createElement('span');
    span.setAttribute("class","spinner-border spinner-border-sm mr-2");
    span.setAttribute("role","status");
    span.setAttribute("aria-hidden",true);
    span.setAttribute("id","load");
    span.style.position = "relative";
    span.style.left = "5px";
    boton.appendChild(span);
    //Creando la imagen de carga en el boton mientras se cargan los datos

  idEvidencias = id;
  const tabla = $("#example1").DataTable();
  const renglon = tabla.row("#row_"+idEvidencias).data();
  const nombre = renglon[0];  

  let titulo = document.getElementById('tituloEvidencias');
  titulo.innerHTML = "Agregar Evidencias - Evento: "+nombre;

  let numHombres = document.getElementById('cantidadHombres');
  let numMujeres = document.getElementById('cantidadMujeres');
  let numExpositores = document.getElementById('cantidadExpo');
  let porMenores = document.getElementById('pormenores');
  let ev1 = document.getElementById('img1');
  let ev2 = document.getElementById('img2');

    $.ajax({
        url: 'php/leerEvidencias.php',
        type: 'post',
        data:{
          id : idEvidencias,
        },
        success: function(response) {
         let respuesta = JSON.parse(response);

            if (respuesta.estatus != 0) {
              numHombres = document.getElementById('cantidadHombres').value = respuesta.numHombres;
              numMujeres = document.getElementById('cantidadMujeres').value = respuesta.numMujeres;
              numExpositores = document.getElementById('cantidadExpo').value = respuesta.numExpositores;
              porMenores = document.getElementById('pormenores').value = respuesta.pormenores;

              if(respuesta.imagen1 != ""){
                let imagen1 = "img/"+respuesta.imagen1;
                ev1.setAttribute("src",imagen1);
                document.getElementById('source1').innerHTML = "Evidencia 1";
              }
              if(respuesta.imagen2 != ""){
                 let imagen2 =  "img/"+respuesta.imagen2;
                 ev2.setAttribute("src",imagen2);
                 document.getElementById('source2').innerHTML = "Evidencia 2";
              }
              if(respuesta.imagen1 == ""){
                ev1.setAttribute("src","");
                document.getElementById('source1').innerHTML = "Elegir archivo";
              }
              if(respuesta.imagen2 == ""){
                 ev2.setAttribute("src","");
                 document.getElementById('source2').innerHTML = "Elegir archivo";
              }
                 
              $('#modal-lg').modal('show');
              let boton = document.getElementById('botonEvidencia'+idEvidencias);
              boton.innerHTML = "Evidencias";

            }else{
              numHombres = document.getElementById('cantidadHombres').value = "";
              numMujeres = document.getElementById('cantidadMujeres').value = "";
              numExpositores = document.getElementById('cantidadExpo').value = "";
              porMenores = document.getElementById('pormenores').value = "";
              ev1.setAttribute("src","");
              ev2.setAttribute("src","");
              document.getElementById('source1').innerHTML = "Elegir archivo";
              document.getElementById('source2').innerHTML = "Elegir archivo";
              
              $('#modal-lg').modal('show');
              let boton = document.getElementById('botonEvidencia'+idEvidencias);
              boton.innerHTML = "Evidencias";
            }
         }    
    });
}
function leerDatosEvento(){
    $.ajax({
        method : "post",
        url: "php/agregarEventoFecha.php",
        data: {
          action : "descripcion",
          id : idActualizar
        },

        success: function( result ) {
        var resultJSON = JSON.parse(result);//Convertimos el dato JSON
            if(resultJSON.estado == 1){//Si la variable en su posicion estado vale 1, todo salió bien  
              $("#descripcionEdit").val(resultJSON.descripcion);
               let fechaInicio = resultJSON.fechaInicio.toString().substring(0,resultJSON.fechaInicio.length-3);
               let fechaFin = resultJSON.fechaFin.toString().substring(0,resultJSON.fechaFin.length-3);
               $("#edit_reservationtime").data("daterangepicker").setStartDate("'"+fechaInicio+"'");
               $('#edit_reservationtime').data('daterangepicker').setEndDate("'"+fechaFin+"'");
               eventoEditar = resultJSON.tipoEvento;
               categoriaEditar = resultJSON.categoria;


               //Creo los elementos en el select y dependiendo de la bd en el tipo de publico pongo
               //en selected a Externo o Interno
               $('#tipoPublicoEdit option').remove();
               let select = document.getElementById('tipoPublicoEdit');   
               let option = document.createElement('option');
               let option2 = document.createElement('option');
               option.text = "Interno";
               option2.text = "Externo";
                  if(option.text == resultJSON.publico){
                    option.selected = true;
                  }else{
                    option2.selected = true;
                  }
               select.appendChild(option);
               select.appendChild(option2);
               leerTipoDeEventoEdit(); 
               leerCategoriaEdit();
            }else{
              alert(resultJSON.mensaje);//Si hubo un error, mandamos un mensaje
            }
        }
      });
}
function leerTipoDeEventoEdit(){//Leemos los datos de la tabla de tipo de evento para poner los datos en el select
  $.ajax({
        method : "post",
        url: "php/obtenerTipoEvento.php",
        data: {
          action : "read"
        },
        success: function( result ) {
        var resultJSON = JSON.parse(result);//Convertimos el dato JSON
        $('#tipoDeEventoEdit option').remove();
            if(resultJSON.estado == 1){//Si la variable en su posicion estado vale 1, todo salió bien  
                resultJSON.tipos_eventos.forEach(function(tipo_evento){//Recorremos cada valor obtenido
                    let select = document.getElementById('tipoDeEventoEdit');   
                    let option = document.createElement('option');
                    option.text = tipo_evento.nombre;
                    option.value = tipo_evento.nombre;

                    if(option.text == eventoEditar){
                        option.selected = true;
                    }else{
                      option.selected = false;
                    }
                    select.appendChild(option);
                });
  
            }else{
              alert(resultJSON.mensaje);//Si hubo un error, mandamos un mensaje
              let boton = document.getElementById('botonEditar'+idActualizar);
              boton.innerHTML = "Actualizar";
            }
        }
  });
}
function leerCategoriaEdit(){

  $.ajax({
    method : "post",
    url: "php/obtenerCategorias.php",
    data: {
      action : "read"
    },
    success: function( result ) {
    var resultJSON = JSON.parse(result);//Convertimos el dato JSON
    $('#categoriaEdit option').remove();
        if(resultJSON.estado == 1){//Si la variable en su posicion estado vale 1, todo salió bien  
            resultJSON.categorias.forEach(function(categoria){//Recorremos cada valor obtenido
                let select = document.getElementById('categoriaEdit');   
                let option = document.createElement('option');
                option.text = categoria.nombre;
                option.value = categoria.nombre;

                if(option.text == categoriaEditar){
                  option.selected = true;
                }else{
                  option.selected = false;
                }
                select.appendChild(option);
            });
            
            $('#modal-info').modal('show');
            let boton = document.getElementById('botonEditar'+idActualizar);
            boton.innerHTML = "Actualizar";
            
        }else{
          alert(resultJSON.mensaje);//Si hubo un error, mandamos un mensaje
          let boton = document.getElementById('botonEditar'+idActualizar);
          boton.innerHTML = "Actualizar";
        }
    }
  });
}
function leerDatosEventoDelete(){
    $.ajax({
        method : "post",
        url: "php/agregarEventoFecha.php",
        data: {
          action : "descripcion",
          id : idEliminar
        },
        success: function( result ) {

        var resultJSON = JSON.parse(result);//Convertimos el dato JSON
            if(resultJSON.estado == 1){//Si la variable en su posicion estado vale 1, todo salió bien 
               document.getElementById('descripcionElim').value = resultJSON.descripcion;
               document.getElementById('fechaDeInicioElim').innerHTML =  resultJSON.fechaInicio.substring(0,resultJSON.fechaInicio.length-3);
               document.getElementById('fechDeFinElim').innerHTML = resultJSON.fechaFin.substring(0,resultJSON.fechaFin.length-3);
               document.getElementById('categoriaElim').innerHTML = resultJSON.categoria;
               document.getElementById('tipoDeEventoElim').innerHTML = resultJSON.tipoEvento;
               document.getElementById('publicoElim').innerHTML = resultJSON.publico;
               $('#modal-danger').modal('show');
               let boton = document.getElementById('botonEliminar'+idEliminar);
               boton.innerHTML = "Eliminar";
            }else
              alert(resultJSON.mensaje);//Si hubo un error, mandamos un mensaje
              $('#modal-danger').modal('show');
              let boton = document.getElementById('botonEliminar'+idEliminar);
              boton.innerHTML = "Eliminar";
        }
      });
}
function logOut(){
    $.ajax({
        url: "php/login.php",
        data: {
          accion:"logout"
        },
        success: function( result ) {
            window.location.replace("login.html");
        }
      });
}

function agregarEvidencias(){
        let hombres = $('#cantidadHombres').val();
        let mujeres = $('#cantidadMujeres').val();
        let cantidadExpo = $('#cantidadExpo').val();
        let pormenores = $('#pormenores').val();
        var formData = new FormData();
        var formData2 = new FormData();

        var files1 = $('#exampleInputFile')[0].files[0];
        var foto1 = $('#exampleInputFile').val();
        var foto2 = $('#exampleInputFile1').val();
        formData.append('file',files1);
        formData.append("ID", idEvidencias);

        var files2 = $('#exampleInputFile1')[0].files[0];
        formData2.append('file',files2);
        formData2.append("ID", idEvidencias);

        const tabla = $("#example1").DataTable();
        const renglon = tabla.row("#row_"+idEvidencias).data();
        const nombre = renglon[0];  

        

        if(hombres == "" || mujeres == "" || cantidadExpo == "" || pormenores == ""){
            toastr.error('Faltan campos! Verifiquelos');
        }else{
        
         $.ajax({
           method : "post",
            url: 'php/subirEvidencias.php',
            data:{
                id : idEvidencias,
                hombres : hombres,
                mujeres : mujeres,
                expo : cantidadExpo,
                pormenores : pormenores
            },
            success: function(response) {
                if(response== 1){
                   toastr.success('Datos del evento '+nombre+' agregadas exitosamente');
                }else{
                   toastr.info('No se hicieron modificaciones en los datos');
                }

                if(foto1 == "" && $("#img1").attr("src") == ""){
                  toastr.error('Error al subir evidencia 1');
                }else if(foto1 == "" && $("#img1").attr("src") != ""){
                  toastr.info('No se hicieron modificaciones a la evidencia 1');
                }else{
                $.ajax({
                 url: 'php/subirImagenes.php',
                 type: 'post',
                 data: formData,
                 contentType: false,
                 processData: false,
                  success: function(response) {
                    let variable = JSON.parse(response);
                       if(variable.estatus == -1){
                         toastr.error('Formato evidencia 1 incorrecto');
                       }else if(variable.estatus == -2){
                         toastr.error('Error al subir la evidencia 1');
                       }else if(variable.estatus == 1){
                         toastr.success('Evidencia 1 cargada exitosamente');
                         document.getElementById('exampleInputFile').value = "";
                       }                       
                  }
                });
              }

               if(foto2 == "" && $("#img2").attr("src") == ""){
                  toastr.error('Error al subir evidencia 2');
                }else if(foto2 == "" && $("#img2").attr("src") != ""){
                  toastr.info('No se hicieron modificaciones a la evidencia 2');
                }else{

                     $.ajax({
                      url: 'php/subirImagenes1.php',
                      type: 'post',
                      data: formData2,
                      contentType: false,
                      processData: false,
                      success: function(response) {
                         let variable = JSON.parse(response);
                           if(variable.estatus == -1){
                             toastr.error('Formato evidencia 2 incorrecto');
                           }else if(variable.estatus == -2){
                             toastr.error('Error al subir la evidencia 2');
                           }else if(variable.estatus == 1){
                             toastr.success('Evidencia 2 cargada exitosamente');
                             document.getElementById('exampleInputFile1').value = "";
                           } 
                      }
                    })  
                }

             }

          });

      }

}