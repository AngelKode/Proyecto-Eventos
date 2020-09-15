//Variables para poder actualizar y eliminar las categorías
let idActualizar = 0;
let idEliminar = 0;

function actionCreate(){

    let nombreCategoria = document.getElementById("categoriaAgregar").value;
    let observacionCategoria = document.getElementById("observacionAgregar").value;
    $("#btnAgregarCateg").attr("data-dismiss","");
    
    if(nombreCategoria == "" && observacionCategoria != ""){
        $(function() {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000
            });
            Toast.fire({
                type: 'warning',
                title: 'Ingrese la Categoría!'
              })
        });
    }else if(observacionCategoria == "" && nombreCategoria != ""){
        $(function() {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000
            });
            Toast.fire({
                type: 'warning',
                title: 'Ingrese la Observacion!'
              })
        });
    }else if(nombreCategoria == "" && observacionCategoria == ""){
        $(function() {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000
            });
            Toast.fire({
                type: 'warning',
                title: 'Ingrese la Categoría y la Observacion!'
              })
        });
    }else{

      $("#btnAgregarCateg").attr("data-dismiss","modal");//Cerramos el modal
      
      $.ajax({
        method : "post",
        url: "php/agregarCategoria.php",
        data: {
          action : "create",
          nombre : nombreCategoria,
          observaciones : observacionCategoria,
        },
        success: function( result ) {
            let resultadoJSON = JSON.parse(result);

            if(resultadoJSON.estatus == 1){
                    
                 Botones = '<button type="button" class="btn btn-info" data-toggle="modal" data-target="#modal-info" onclick = "identificarEditar('+resultadoJSON.ultimoID+');">Editar</button> <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#modal-danger" onclick = "identificarEliminar('+resultadoJSON.ultimoID+');">Eliminar</button>';
                 let tabla = $("#example1").DataTable(); 
                 tabla.row.add([
                        nombreCategoria,//Agregamos el nombre a la tabla
                        observacionCategoria,//Las observaciones
                        Botones]).draw().node().id= "row_"+resultadoJSON.ultimoID;

                        //Notificacion de exito
                        $(function() {
                            const Toast = Swal.mixin({
                              toast: true,
                              position: 'top-end',
                              showConfirmButton: false,
                              timer: 3000
                            });

                              Toast.fire({
                                  type: 'success',
                                  title: 'La categoría ha sido guardada exitósamente!'
                              })

                        });
                        document.getElementById("categoriaAgregar").value = "";
                        document.getElementById("observacionAgregar").value = "";
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
                      title: 'Error al guardar la categoría!'
                  })

              });
            }
        }
      });
    }
}
function actionRead(){

  //Checamos la sesión
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

  //Checamos la sesion

    $.ajax({
        method : "post",
        url: "php/agregarCategoria.php",
        data: {
          action : "read"
        },
        success: function( result ) {
            
            var resultJSON = JSON.parse(result);//Convertimos el dato JSON

            if(resultJSON.estado == 1){//Si la variable en su posicion estado vale 1, todo salió bien
                
                var tabla= $('#example1').DataTable();//Tipo datatable
  
                resultJSON.categoria.forEach(function(datos){//Recorremos cada valor obtenido
                    
                    Botones = '<button type="button" class="btn btn-info" data-toggle="modal" data-target="#modal-info" onclick = "identificarEditar('+datos.id+');">Editar</button> <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#modal-danger" onclick = "identificarEliminar('+datos.id+');">Eliminar</button>';
 
                    tabla.row.add([
                        datos.nombre,//Agregamos el nombre a la tabla
                        datos.observaciones,//Las observaciones
                        Botones]).draw().node().id= "row_"+datos.id;  //Y los botones de Eliminar y editar
  
                });
                
            }else
              alert(resultJSON.mensaje);//Si hubo un error, mandamos un mensaje
        }
    });
}
function actionUpdate(){

  //Obtenemos los datos a modificar
  $("#btnActCateg").attr("data-dismiss","");
  let nombreActualizar = document.getElementById("categoriaAct").value;
  let observacionActualizar = document.getElementById("observacionesAct").value;
  if(nombreActualizar == "" || observacionActualizar == ""){
    $(function() {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });

        Toast.fire({
            type: 'warning',
            title: 'Faltan datos. Verifíquelos!'
        })

  });
  }else{
   $("#btnActCateg").attr("data-dismiss","modal");
  //A través de ajax mandamos actualizar la BD
      $.ajax({
          method : "post",
          url: "php/agregarCategoria.php",
          data: {
              action : "update",
              id : idActualizar,
              nombre : nombreActualizar,
              observaciones : observacionActualizar
          },
          success: function( result ) {

            let resultJSON = JSON.parse(result);
            let nombreNuevo = document.getElementById("categoriaAct").value;
            let observacionNueva = document.getElementById("observacionesAct").value;

            if(resultJSON.estado == 1){

              //Actualizamos la tabla
              let tabla = $("#example1").DataTable();
              let renglon = tabla.row("#row_"+idActualizar).data();
              renglon[0] = nombreNuevo;
              renglon[1] = observacionNueva;

              tabla.row("#row_"+idActualizar).data(renglon);
              
              //Mandamos un Toast para decirle al usuario que los cambios se hicieron
                  $(function() {
                      const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000
                      });

                        Toast.fire({
                            type: 'success',
                            title: 'La categoría ha sido actualizada exitósamente!'
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
                          title: 'No se hicieron modificaciones a la categoría!'
                      })

                  });

            }
          }
        });
  }
}
function actionDelete(){
     
  $.ajax({
    method : "post",
    url: "php/agregarCategoria.php",
    data: {
        action : "delete",
        id : idEliminar
    },
    success: function( result ) {
       let resultJSON = JSON.parse(result);

       if(resultJSON.estatus == 1){

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
                      title: 'La categoría ha sido eliminada exitósamente!'
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
                    title: 'Error al eliminar la categoría. Inténtelo nuevamente'
                })

          });

       }
    }
  });

}

function identificarEliminar(id){

    idEliminar = id;
    const tabla = $("#example1").DataTable();
    const renglon = tabla.row("#row_"+id).data();

    const nombre = renglon[0];
    const observaciones = renglon[1];

    document.getElementById("categoriaEliminar").innerHTML = nombre;
    document.getElementById("observacionEliminar").innerHTML = observaciones;

}

function identificarEditar(id){

    idActualizar = id;
    const tabla = $("#example1").DataTable();
    const renglon = tabla.row("#row_"+id).data();

    const nombre = renglon[0];
    const observaciones = renglon[1];

    document.getElementById("categoriaAct").value = nombre;
    document.getElementById("observacionesAct").value = observaciones;
}