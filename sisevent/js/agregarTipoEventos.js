//CRUD DE LA TABLA
let idActualizar = 0;
let idEliminar = 0;

function actionDelete(){
    $.ajax({
        method : "post",
        url: "php/agregarEventos.php",
        data: {
            action : "delete",
            id : idEliminar
        },
        success: function( result ) {
           let resultJSON = JSON.parse(result);

           if(resultJSON.estatus == 1){

              let tabla = $("#example1").DataTable();//Obtenemos la DataTable
              tabla.row("#row_"+idEliminar).remove().draw();//Removemos el item de la tabla usando el idEliminar
              mostrarToastSuccess('El evento ha sido eliminado exitósamente!');//Mandamos mensaje de éxito

           }else{//Mandamos mensaje al haber un error al querer eliminar el evento
              mostrarToastError(resultJSON.mensaje);
           }
        }
    });
}
function actionRead(){

  //-----------------------------------Checar sesion---------------------------------------------
    var nombreUsuario = sessionStorage.getItem("data");//Obtenemos el valor del session storage
    if(nombreUsuario != null){
      if(sessionStorage.getItem("admin") == "Si"){
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
      setTimeout(function(){ window.location.replace("login.html"); }, 2000);
      clearTimeout();
    }
  //-----------------------------------Checar sesion---------------------------------------------

    $.ajax({
        method : "post",
        url: "php/agregarEventos.php",
        data: {
          action : "read"
        },
        success: function( result ) {

            let resultJSON = JSON.parse(result);//Convertimos el dato JSON

            if(resultJSON.estado == 1){//Si la variable en su posicion estado vale 1, todo salió bien
                
                let tabla= $('#example1').DataTable();//Tipo datatable
  
                resultJSON.tipos_eventos.forEach(function(tipo_evento){//Recorremos cada valor obtenido
                    
                  Botones = '<button type="button" class="btn btn-info" data-toggle="modal" data-target="#modal-info" onclick = "identificarEditar('+tipo_evento.id+');">Editar</button> <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#modal-danger" onclick = "identificarEliminar('+tipo_evento.id+');">Eliminar</button>';
  
                  tabla.row.add([
                          tipo_evento.nombre,//Agregamos el nombre a la tabla
                          tipo_evento.observaciones,//Las observaciones
                          Botones //Y los botones de Eliminar y editar
                  ]).draw().node().id= "row_"+tipo_evento.id; 
  
                });
                
            }else{
              //Mandamos mensaje de error en caso de fallo
              mostrarToastError(resultJSON.mensaje);

            }
        }
    });
}

function actionUpdate(){

    let nombreActualizar = document.getElementById("nombreAct").value;
    let observacionActualizar = document.getElementById("observacionesAct").value;
    $("#btnActTipoEvento").attr("data-dismiss","");
    if(nombreActualizar == "" || observacionActualizar == ""){

      mostrarToastWarning('Faltan datos. Verifíquelos!');

    }else{

      $("#btnActTipoEvento").attr("data-dismiss","modal");
      $.ajax({
          method : "post",
          url: "php/agregarEventos.php",
          data: {
              action : "update",
              id : idActualizar,
              nombre : nombreActualizar,
              observaciones : observacionActualizar
          },
          success: function( result ) {
            let resultJSON = JSON.parse(result);
            let nombreNuevo = document.getElementById("nombreAct").value;
            let observacionNueva = document.getElementById("observacionesAct").value;

            if(resultJSON.estado == 1){

              let tabla = $("#example1").DataTable();
              let renglon = tabla.row("#row_"+idActualizar).data();
              renglon[0] = nombreNuevo;
              renglon[1] = observacionNueva;

              tabla.row("#row_"+idActualizar).data(renglon);
                  
              mostrarToastSuccess('El evento ha sido actualizado exitósamente!');
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
                  title: resultJSON.mensaje+"!"
                })
              });

            }
          }
      });
    }
}

function actionCreate(){

    let nombreCrear = document.getElementById("eventoAgregar").value;
    let observacionCrear = document.getElementById("observacionAgregar").value;
    $("#btnAgregarTipEv").attr("data-dismiss","");

    if(nombreCrear == "" && observacionCrear != ""){
      
      toastWarning('Ingrese el Evento!');

    }else if(observacionCrear == "" && nombreCrear != ""){

      toastWarning('Ingrese la Observacion!');

    }else if(nombreCrear == "" && observacionCrear == ""){
       
      toastWarning('Ingrese el Evento y la Observacion!');

    }else{

      $("#btnAgregarTipEv").attr("data-dismiss","modal");//Cerramos el modal

      $.ajax({
          method : "post",
          url: "php/agregarEventos.php",
          data: {
            action : "create",
            nombre : nombreCrear,
            observaciones : observacionCrear,
          },
          success: function( result ) {
              let resultadoJSON = JSON.parse(result);

              if(resultadoJSON.estatus == 1){
                      
                  Botones = '<button type="button" class="btn btn-info" data-toggle="modal" data-target="#modal-info" onclick = "identificarEditar('+resultadoJSON.ultimoID+');">Editar</button> <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#modal-danger" onclick = "identificarEliminar('+resultadoJSON.ultimoID+');">Eliminar</button>';
                  let tabla = $("#example1").DataTable(); 

                  tabla.row.add([
                          nombreCrear,//Agregamos el nombre a la tabla
                          observacionCrear,//Las observaciones
                          Botones
                  ]).draw().node().id= "row_"+resultadoJSON.ultimoID;

                  //Notificacion de exito
                  toastSuccess('El evento ha sido guardado exitósamente!');

                  //Borramos los datos de los input
                  document.getElementById("eventoAgregar").value = "";
                  document.getElementById("observacionAgregar").value = "";

              }else{

                  toastError("Error al insertar. Por favor, intentelo de nuevo!");
                  
              }
          }//Success
      });//AJAX
    }
}
function identificarEliminar(id){

    idEliminar = id;
    const tabla = $("#example1").DataTable();
    const renglon = tabla.row("#row_"+id).data();

    const nombre = renglon[0];
    const observaciones = renglon[1];

    document.getElementById("eventoEliminar").innerHTML = nombre;
    document.getElementById("observacionEliminar").innerHTML = observaciones;

}

function identificarEditar(id){

    idActualizar = id;
    const tabla = $("#example1").DataTable();
    const renglon = tabla.row("#row_"+id).data();

    const nombre = renglon[0];
    const observaciones = renglon[1];

    $("#nombreAct").val(nombre);
    $("#observacionesAct").val(observaciones);
}

function mostrarToastSuccess(textoToast){
    $(function() {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
      Toast.fire({
          type: 'success',
          title: textoToast
        })
    });
}

function mostrarToastError(textoToast){
    $(function() {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
      Toast.fire({
          type: 'error',
          title: textoToast
        })
    });
}

function mostrarToastWarning(textoToast){
    $(function() {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
      Toast.fire({
          type: 'warning',
          title: textoToast
        })
    });
}