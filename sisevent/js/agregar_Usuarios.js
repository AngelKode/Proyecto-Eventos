//Variables para poder actualizar y eliminar las categorías
let idActualizar = 0;
let idEstatus = 0;

function actionCreate(){


    //Obtenemos los datos del usuario
        let nombreRealUsuario = document.getElementById("nombreCompletoUsuario").value;
        let correoUsuario = document.getElementById("correoUsuario").value;
        let numeroTelefono = document.getElementById("celularUsuario").value;
        let nombreUsuario = document.getElementById("nombreUsuarioAgregar").value;
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
    }else if(nombreRealUsuario == "" || correoUsuario == "" || numeroTelefono == "" || contrasenia == ""){
        $(function() {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });

            Toast.fire({
                type: 'warning',
                title: 'Faltan datos, por favor llene todos los campos'
            })
        });
    }else{
      $("#btnAgregar").attr("data-dismiss","modal");
      $("#contraseñaUsuario").attr("class","form-control");
      $("#contraseñaUsuario-Validar").attr("class","form-control");

      $.ajax({
        method : "post",
        url: "php/agregarUsuario.php",
        data: {
          action : "create",
          nombre : nombreRealUsuario,
          correo : correoUsuario,
          telefono : numeroTelefono,
          usuarioCrear : nombreUsuario,
          passwrd : contrasenia,
          boolEditor : editorMemInst
        },
        success: function( result ) {
          let resultadoJSON = JSON.parse(result);
          if(resultadoJSON.correoRepetido == "No" && resultadoJSON.usuarioRepetido == "No"){//Si hay algun dato repetido
            if(resultadoJSON.estatus == 1){
                    
              BotonAccion = '<button type="button" class="btn btn-info" data-toggle="modal" data-target="#modal-info" onclick = "identificarEditar('+resultadoJSON.ultimoID+');">Editar</button>';
              BotonEstado = '<button type="button" class="btn btn-outline-success" id = "botonEstatus'+resultadoJSON.ultimoID+'" onclick = "identificarEstatus('+resultadoJSON.ultimoID+');">Activo</button>';
                 let tabla = $("#example1").DataTable(); 
                 tabla.row.add([//Agregamos los datos a la tabla
                        nombreRealUsuario,
                        correoUsuario,
                        numeroTelefono,
                        nombreUsuario,
                        contrasenia,
                        editorMemInst,
                        BotonAccion,
                        BotonEstado]).draw().node().id= "row_"+resultadoJSON.ultimoID;

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
                                  title: 'El usuario ha sido guardado exitósamente!'
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
                      title: 'Error al guardar el usuario!'
                  })

              });
            }
          }else{
             
              if(resultadoJSON.correoRepetido == "Si" && resultadoJSON.usuarioRepetido == "No"){
                  $(function() {
                    const Toast = Swal.mixin({
                      toast: true,
                      position: 'top-end',
                      showConfirmButton: false,
                      timer: 3000
                    });
    
                      Toast.fire({
                          type: 'error',
                          title: 'Correo existente. Inténtelo nuevamente!'
                      })
    
                  });
              }else if(resultadoJSON.correoRepetido == "No" && resultadoJSON.usuarioRepetido == "Si"){
                  $(function() {
                    const Toast = Swal.mixin({
                      toast: true,
                      position: 'top-end',
                      showConfirmButton: false,
                      timer: 3000
                    });
    
                      Toast.fire({
                          type: 'error',
                          title: 'Usuario existente. Inténtelo nuevamente!'
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
                          title: 'Usuario y Correo existentes. Inténtelo nuevamente!'
                      })
    
                  }); 
              }

          }
        }
      });
    }
}
function actionRead(){
  //Checar sesion
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
  //Checar sesion
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
                    
                    BotonAccion = '<button type="button" class="btn btn-info" data-toggle="modal" data-target="#modal-info" onclick = "identificarEditar('+datos.id+');">Editar</button>';
                    
                    //Aqui checamos el estado del usuario, para asi darle el estilo  
                    if(datos.estado == "Activo"){
                        BotonEstado = '<button type="button" class="btn btn-outline-success" id = "botonEstatus'+datos.id+'" onclick = "identificarEstatus('+datos.id+');">'+datos.estado+'</button>';
                      }else{
                        BotonEstado = '<button type="button" class="btn btn-outline-secondary" id = "botonEstatus'+datos.id+'" onclick = "identificarEstatus('+datos.id+');">'+datos.estado+'</button>';
                      }
                    
                    tabla.row.add([//Agregamos los datos que vamos obteniendo, y al final los dos botones
                        datos.nombre,
                        datos.correo,
                        datos.celular,
                        datos.usuario,
                        datos.contraseña,
                        datos.editorMemInst,
                        BotonAccion,
                        BotonEstado]).draw().node().id= "row_"+datos.id;
  
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

$("#btnActualizar").attr("data-dismiss","");

if(nombreRealUsuarioEdit != "" && correoUsuarioEdit != "" && numeroTelefonoEdit != ""
   && nombreUsuarioEdit != "" && contraseniaEdit != ""){//Checamos si el usuario no dejó campos vacíos

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
                  $("#btnActualizar").attr("data-dismiss","modal");
                  $("#correoUsuarioEdit").attr("class","form-control");
                  $("#nombreUsuarioEdit").attr("class","form-control");
                  $("#modal-info").modal('hide');

                  if($("#labelCE").length > 0){
                    $("#labelCE").remove();
                  }
                  if($("#labelUE").length > 0){
                    $("#labelUE").remove();
                  }
                  
            }else if(resultJSON.estado == 0){

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

                  $("#btnActualizar").attr("data-dismiss","modal");
                  $("#correoUsuarioEdit").attr("class","form-control");
                  $("#nombreUsuarioEdit").attr("class","form-control");
                  $("#modal-info").modal('hide');
                  
                  if($("#labelCE").length > 0){
                    $("#labelCE").remove();
                  }
                  if($("#labelUE").length > 0){
                    $("#labelUE").remove();
                  }

            }else{
                let boolCorreoRepetido = resultJSON.correoRepetido;
                let boolUsuarioRepetido = resultJSON.usuarioRepetido;
                let errorCorreo ='<p style="color:#dc3545; opacity:0.8;" id="labelCE">Correo existente</p>';
                let errorUsuario = '<p style="color:#dc3545; opacity:0.8;" id ="labelUE">Usuario existente</p>';

                if(boolCorreoRepetido == "Si" && boolUsuarioRepetido == "No"){
                  $("#correoUsuarioEdit").attr("class","form-control is-invalid");
                  $("#correoUsuarioEdit").val("");
                    if($("#labelCE").length == 0){
                      $("#correoUsuarioEdit").after(errorCorreo);
                    }
                }else if(boolCorreoRepetido == "No" && boolUsuarioRepetido == "Si"){
                  $("#nombreUsuarioEdit").attr("class","form-control is-invalid");
                  $("#nombreUsuarioEdit").val("");
                    if($("#labelUE").length == 0){
                      $("#nombreUsuarioEdit").after(errorUsuario);
                    }
                }else if(boolCorreoRepetido == "Si" && boolUsuarioRepetido == "Si"){
                  $("#correoUsuarioEdit").attr("class","form-control is-invalid");
                  $("#nombreUsuarioEdit").attr("class","form-control is-invalid");
                  $("#nombreUsuarioEdit").val("");
                  $("#correoUsuarioEdit").val("");

                  if($("#labelCE").length == 0){
                    $("#correoUsuarioEdit").after(errorCorreo);
                  }
                  if($("#labelUE").length == 0){
                    $("#nombreUsuarioEdit").after(errorUsuario);
                  }
                }

            }
          }
        });

   }else{//Si dejó algún campo vacío, le notificamos

    $(function() {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000
      });

        Toast.fire({
            type: 'warning',
            title: 'Faltan campos!'
        })

  });
      
   } 

}
function actionDelete(){
     
  $.ajax({
    method : "post",
    url: "php/agregarUsuario.php",
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

function identificarEstatus(id){
    idEstatus = id;
    let botonEstatus = "botonEstatus"+id;
    let botonDom = document.getElementById(botonEstatus);
    let estadoActual = "";
    let estadoSiguiente = "";

    if(botonDom.textContent == "Activo"){//Con .textContent obtenemos si es "Activo" o "Inactivo"
      estadoActual = "btn btn-outline-success";
      estadoSiguiente = "btn btn-outline-secondary";
      botonDom.textContent = "Inactivo";
    }else{
      estadoActual = "btn btn-outline-secondary";
      estadoSiguiente = "btn btn-outline-success";
      botonDom.textContent = "Activo";
    }

    let jquery = "#"+botonEstatus;//Texto que nos sirve para detectar el objeto con la id usando jquery para luego usarlo
    $(jquery).removeClass(estadoActual).addClass(estadoSiguiente);//Removemos la clase del boton y le agreamos otra

    actualizarEstado(botonDom.textContent);//Usamos ajax para actualizar el estado
}

function actualizarEstado(estadoNuevo){
  $.ajax({
    method : "post",
    url: "php/agregarUsuario.php",
    data: {
      action : "setEstatus",
      estado : estadoNuevo,
      id : idEstatus
    },
    success: function( result ) {
        let resultadoJSON = JSON.parse(result);

        if(resultadoJSON.estado == 1){//Si vale 1, quiere decir que se actualizo correctamente el estado del usuario
            $(function() {
              const tabla = $("#example1").DataTable();
              const renglon = tabla.row("#row_"+idEstatus).data();
              let mensaje = "Estado del usuario "+renglon[3]+" actualizado correctamente!";
              const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
              });

                Toast.fire({
                    type: 'success',
                    title: mensaje
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
                    title: "Error al actualizar el estado, inténtelo nuevamente!"
                })

            });
        }

    }
});
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