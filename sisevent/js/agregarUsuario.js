//Variables para poder actualizar y eliminar las categorías
let idActualizar = 0;
let idEliminar = 0;

function actionCreate(){


    //Obtenemos los datos del usuario
        let nombreRealUsuario = document.getElementById("nombreCompletoUsuario").value;
        let correoUsuario = document.getElementById("correoUsuario").value;
        let numeroTelefono = document.getElementById("celularUsuario").value;
        let nombreUsuario = document.getElementById("nombreUsuario").value;
        let contrasenia = document.getElementById("contraseñaUsuario").value;
        let verificarContrasenia =  document.getElementById("contraseñaUsuario-Validar").value;
        let editorMemInst = document.getElementById("editorUsuario").value;
    //Obtenemos los datos del usuario

    //Modificamos el atributo para evitar que se cierre el modal
    $("#btnAgregar").attr("data-dismiss","");

    //Validamos las contraseñas
    if(contrasenia != verificarContrasenia){
        $("#contraseñaUsuario").attr("class","form-control is-invalid");
        $("#contraseñaUsuario-Validar").attr("class","form-control is-invalid");
    }else{
        //Si son iguales, cerramos el modal
        $("#btnAgregar").attr("data-dismiss","modal");
        $("#contraseñaUsuario").attr("class","form-control");
        $("#contraseñaUsuario-Validar").attr("class","form-control");
    
    

    /*
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
    }
*/
      $.ajax({
        method : "post",
        url: "php/agregarUsuario.php",
        data: {
          action : "create",
          nombre : nombreRealUsuario,
          correo : correoUsuario,
          telefono : numeroTelefono,
          usuario : nombreUsuario,
          passwrd : contrasenia,
          boolEditor : editorMemInst
        },
        success: function( result ) {

            let resultadoJSON = JSON.parse(result);
            if(resultadoJSON.estatus == 1){
                    
                 Botones = '<button type="button" class="btn btn-info" data-toggle="modal" data-target="#modal-info" onclick = "identificarEditar('+resultadoJSON.ultimoID+');">Editar</button> <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#modal-danger" onclick = "identificarEliminar('+resultadoJSON.ultimoID+');">Eliminar</button>';
                 let tabla = $("#example1").DataTable(); 
                 tabla.row.add([//Agregamos los datos a la tabla
                        nombreRealUsuario,
                        correoUsuario,
                        numeroTelefono,
                        nombreUsuario,
                        contrasenia,
                        editorMemInst,
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
    $.ajax({
        method : "post",
        url: "php/agregarUsuario.php",
        data: {
          action : "read"
        },
        success: function( result ) {
            
            var resultJSON = JSON.parse(result);//Convertimos el dato JSON

            if(resultJSON.estado == 1){//Si la variable en su posicion estado vale 1, todo salió bien
                
            var tabla= $('#example1').DataTable();//Tipo datatable
  
                resultJSON.usuario.forEach(function(datos){//Recorremos cada valor obtenido
                    
                    Botones = '<button type="button" class="btn btn-info" data-toggle="modal" data-target="#modal-info" onclick = "identificarEditar('+datos.id+');">Editar</button> <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#modal-danger" onclick = "identificarEliminar('+datos.id+');">Eliminar</button>';
 
                    tabla.row.add([
                        datos.nombre,//Agregamos el nombre a la tabla
                        datos.correo,
                        datos.celular,
                        datos.usuario,
                        datos.contraseña,
                        datos.editorMemInst,//Las observaciones
                        Botones]).draw().node().id= "row_"+datos.id;  //Y los botones de Eliminar y editar
  
                });
                
            }else
              alert(resultJSON.mensaje);//Si hubo un error, mandamos un mensaje
        }
      });
}
function actionUpdate(){

  //Obtenemos los datos del usuario
  let nombreRealUsuarioEdit = document.getElementById("nombreCompletoUsuarioEdit").value;
  let correoUsuarioEdit = document.getElementById("correoUsuarioEdit").value;
  let numeroTelefonoEdit = document.getElementById("celularUsuarioEdit").value;
  let nombreUsuarioEdit = document.getElementById("nombreUsuarioEdit").value;
  let contraseniaEdit = document.getElementById("contraseñaUsuarioEdit").value;
  let editorMemInstEdit = document.getElementById("editorUsuarioEdit").value;
//Obtenemos los datos del usuario

  //A través de ajax mandamos actualizar la BD
  $.ajax({
      method : "post",
      url: "php/agregarUsuario.php",
      data: {
          action : "update",
          id : idActualizar,
          nombre : nombreRealUsuarioEdit,
          correo : correoUsuarioEdit,
          telefono : numeroTelefonoEdit,
          usuario : nombreUsuarioEdit,
          passwrd : contraseniaEdit,
          boolEditor : editorMemInstEdit
      },
      success: function( result ) {
         let resultJSON = JSON.parse(result);
         if(resultJSON.estado == 1){

          //Actualizamos la tabla
          let tabla = $("#example1").DataTable();
          let renglon = tabla.row("#row_"+idActualizar).data();
          renglon[0] = nombreRealUsuarioEdit;
          renglon[1] = correoUsuarioEdit;
          renglon[2] = numeroTelefonoEdit;
          renglon[3] = nombreUsuarioEdit;
          renglon[4] = contraseniaEdit;
          renglon[5] = editorMemInstEdit;

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
                        title: 'El usuario ha sido actualizado exitósamente!'
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
                      title: 'No se hicieron modificaciones al usuario!'
                  })

              });

         }
      }
    });

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
    const correo = renglon[1];
    const telefono = renglon[2];
    const usuario = renglon[3];
    const contra = renglon[4];
    const editor = renglon[5];

    document.getElementById("nombreCompletoUsuarioEdit").value = nombre;
    document.getElementById("correoUsuarioEdit").value = correo;
    document.getElementById("celularUsuarioEdit").value = telefono;
    document.getElementById("nombreUsuarioEdit").value = usuario;
    document.getElementById("contraseñaUsuarioEdit").value = contra;

    //Para seleccionar la opcion actual del select
    $('#editorUsuarioEdit option').remove();//Quitamos las opciones
    
    let select = document.getElementById('editorUsuarioEdit');   
    let option = document.createElement('option');

    option.text = "Si";
    option.value = "Si";

    if(option.text == editor){
        option.selected = true;
    }else{
      option.selected = false;
    }
    select.appendChild(option);

    let option2 = document.createElement('option');
    option2.text = "No";
    option2.value = "No";

    if(option2.text == editor){
      option2.selected = true;
    }else{
      option2.selected = false;
    }
    select.appendChild(option2);
}