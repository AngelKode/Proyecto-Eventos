let idEventoMostrar = 0;
let estadoActual = 0;
let años = Array();
let arregloNombres = ["Nombre del Evento","Modalidad", "Tipo de Evento", "Rama", "Duración en Horas",
                     "# de Registro", "Fecha de Inicio", "Fecha de Termino", "# Hombres", "# Mujeres",
                     "Forma de Pago", "Instancia Atendida", "Procedencia del Capacitador"
                    ];

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
    
    //Creando los select para filtrar los datos
    

     //Creando los select para filtrar los datos
    $.ajax({
        method : "post",
        url: "php/obtenerEventosResumen.php",
        data : {
            action : 'read'
        },
        success: function( result ) {
            let resultadoJSON = JSON.parse(result);
            let tablaResumen = $("#tablaDatosEvento").DataTable();
            //Con el siguiente siclo forEach, recorremos el arreglo de los datos para agregarlos a la tabla
                resultadoJSON.evento.forEach(evento => {
                let boolCapturado;    
                    if(evento.datoCapturado == 0){
                       boolCapturado = "No";
                    }else{
                       boolCapturado = "Si";
                    }    
                    btnMostrarEventoResumen = '<button type="button" class="btn btn-info" id = "botonCapturado'+evento.id+'" onclick = "identificarEstadoCapturado('+evento.id+');">Mostrar</button>';

                    let fechaInicio = evento.inicio;
                    let fechaFin = evento.fin;
                    //Operacion para obtener fecha inicio
                        let yy = fechaInicio.substr(0,4);
                            años.push(yy);
                        fechaInicio = fechaInicio.substr(5);
                        let mm = fechaInicio.substr(0,2);
                        fechaInicio = fechaInicio.substr(3);
                        let dd = fechaInicio.substr(0,2);
                        fechaInicio = yy+"/"+mm+"/"+dd;
                     //Operacion para obtener fecha de fin
                        yy = fechaFin.substr(0,4);
                        fechaFin = fechaFin.substr(5);
                            años.push(yy);
                        mm = fechaFin.substr(0,2);
                        fechaFin = fechaFin.substr(3);
                        dd = fechaFin.substr(0,2);
                        fechaFin = yy+"/"+mm+"/"+dd;

                        tablaResumen.row.add([
                            evento.nombre,
                            evento.tipo,
                            fechaInicio,
                            fechaFin,
                            boolCapturado,
                            btnMostrarEventoResumen
                        ]).draw().node().id= "row_"+evento.id;
                });
                años = [...new Set(años)]//Eliminamos repetidos
                crearElementosFiltrar();
        }
    });
}

function identificarEstadoCapturado(idEvento){
    
    //Desactivamos el boton mientras se ejecuta la peticion al servidor
    $("#botonCapturado"+idEvento).addClass("disabled");
    //Borramos todas las filas del tbody para que no se repitan
    $("#tablaDatosModal tbody tr").remove();

    idEventoMostrar = idEvento;
    let tabla = $("#tablaDatosEvento").DataTable();
    let renglon = tabla.row("#row_"+idEvento).data();

    //Checamos el valor de la tabla, para saber el estado actual del evento
        if(renglon[4] == "Si"){
            $("#labelEstatus").html("El evento ya está capturado!");
            estadoActual = "Si";
            if($("#btnActTipoEvento").hasClass("btn-warning")){
                $("#btnActTipoEvento").removeClass("btn-warning");
                $("#btnActTipoEvento").addClass("btn-success");
            }else if(!$("#btnActTipoEvento").hasClass("btn-success")){
                $("#btnActTipoEvento").addClass("btn-success");
            }
        }else{
            $("#labelEstatus").html("El evento aún no se ha capturado. Presione el boton 'Capturado' cuando ya lo este");
            estadoActual = "No";
            if($("#btnActTipoEvento").hasClass("btn-success")){
                $("#btnActTipoEvento").removeClass("btn-success");
                $("#btnActTipoEvento").addClass("btn-warning");
            }else if(!$("#btnActTipoEvento").hasClass("btn-warning")){
                $("#btnActTipoEvento").addClass("btn-warning");
            }    
        }
    //Checamos el valor de la tabla, para saber el estado actual del evento

    $.ajax({
        method : "post",
        url : "php/obtenerEventosResumen.php",
        data : {
            action : 'leerParaModal',
            id : idEvento
        },success : function (result){
            let resultadoJSON = JSON.parse(result);

            if(resultadoJSON.estatus == 1){
                //Aqui recorremos el array de los nombres y en base a la respuesta de la peticion a la BD,
                //ponemos los datos en la tabla del modal
                ponerDatosModal(resultadoJSON);                
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
                          title: "Error al hacer la petición!"
                      })
      
                  }); 

            }

        }
    });
}

function actualizarEstadoCapturado(){
    $("#btnActTipoEvento").addClass("disabled");//Para evitar errores, y esperar a tener respuesta del servidor
    if(estadoActual == "Si"){
        nuevoEstado = 0;
    }else{
        nuevoEstado = 1;
    }
    
    $.ajax({
        method : "post",
        url: "php/obtenerEventosResumen.php",
        data: {
          action : "actualizarCapturado",
          estado : nuevoEstado,
          id : idEventoMostrar
        },
        success: function( result ) {
            $("#btnActTipoEvento").removeClass("disabled");//Una vez teniendo respuesta, habilitamos de nuevo el boton
            let resultadoJSON = JSON.parse(result);
            
            //Obtenemos la tabla principal y el renglon de los datos
            let tabla = $("#tablaDatosEvento").DataTable();
            let renglon = tabla.row("#row_"+idEventoMostrar).data();
        
            if(resultadoJSON.estado == 1){//Si vale 1, quiere decir que se actualizo correctamente el estado del usuario
                //Cambiamos la presentación del modal
                if(estadoActual == "Si"){//Para este punto, el estado ya es pasado
                    $("#labelEstatus").html("El evento aún no se ha capturado. Presione el boton 'Capturado' cuando ya lo este");//Cambiamos el label del modal
                    $("#btnActTipoEvento").removeClass("btn-success");//Quitamos el boton verde
                    $("#btnActTipoEvento").addClass("btn-warning");//Y ponemos el amarillo
                    renglon[4] = "No";//Actualizamos la posicion donde dice si esta capturado o no
                    estadoActual = "No";
                }else{
                    $("#labelEstatus").html("El evento ya está capturado!");//Cambiamos el label del modal
                    $("#btnActTipoEvento").removeClass("btn-warning");//Quitamos el boton amarillo
                    $("#btnActTipoEvento").addClass("btn-success");//Y agregamos el boton verde
                    renglon[4] = "Si";//Actualizamos la posicion donde dice si esta capturado o no
                    estadoActual = "Si";
                }
                tabla.row("#row_"+idEventoMostrar).data(renglon);//Actualizamos la tabla con los nuevos datos

                $(function() {//Y por ultimo mandamos un toast para decirle al usuario que se actualizó correctamente
                  const tabla = $("#tablaDatosEvento").DataTable();
                  const renglon = tabla.row("#row_"+idEventoMostrar).data();
                  let mensaje = "Estado del evento '"+renglon[0]+"' actualizado correctamente!";
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

function crearElementosFiltrar(){
    $( document ).ready(function() { 
        //Primero insertamos los select, y para ellos, tenemos que obtener la direccion del primer div para insertarlos
        let contenedor = $("#tablaDatosEvento_wrapper > div > div");
        let registrosNum = contenedor[0];
        let buscar = contenedor[1];

        registrosNum.setAttribute("class","col-sm-12 col-md-3 d-flex align-items-center justify-content-center");
            //Configurando el div de enmedio
            let divFilter = document.createElement("div");
            divFilter.setAttribute("class","col-sm-12 col-md-6 row justify-content-center");
            
            //Elementos del div
            //Crearemos 3 divs
            let divSelectAño = document.createElement("div");
            let divSelectTrimestres = document.createElement("div");
            let divBotonFiltrar = document.createElement("div");
            //Ahora los elementos de cada div
            let selectAño = document.createElement("select");
            let formGroupSelectAño = document.createElement("div");
            let selectTrimestres = document.createElement("select");
            let formGroupSelectTrimestres = document.createElement("div");
            let formGroupBoton = document.createElement('div');
            let botonFiltrar = document.createElement("button");

            //Configurando los divs
            divSelectAño.setAttribute("class","col-md-3 col-sm-5");
            divSelectTrimestres.setAttribute("class"," col-md-3 col-sm-5");
            divBotonFiltrar.setAttribute("class","col-md-2 col-sm-2 d-flex align-items-center");
            
            
            divFilter.appendChild(divSelectAño);
                selectAño.setAttribute("class","form-control select select2");
                let labelPorAño = document.createElement("label");
                labelPorAño.innerHTML = "Año";
                labelPorAño.style.setProperty("margin-bottom","0px");
                selectAño.setAttribute("id","selectAño");
                let arregloDeOptions = [];
                    años.forEach(valorAño =>{//Checando los valores de la BD
                        let option = document.createElement("option");
                        option.text = valorAño;
                        option.value = valorAño;
                        arregloDeOptions.push(option);
                    });
                    let optionTodos = document.createElement("option");
                    optionTodos.value = "Todos";
                    optionTodos.text = "Todos";
                    selectAño.appendChild(optionTodos);
                    arregloDeOptions.forEach(options =>{//Luego con esos datos, vamos creando los options
                        selectAño.appendChild(options);
                    })
                formGroupSelectAño.setAttribute("class","form-group");
                formGroupSelectAño.appendChild(labelPorAño);
                formGroupSelectAño.appendChild(selectAño);
                divSelectAño.appendChild(formGroupSelectAño);
            divFilter.appendChild(divSelectTrimestres);
                selectTrimestres.setAttribute("class","form-control select select2");
                let labelPorTrim = document.createElement("label");
                labelPorTrim.innerHTML = "Trimestre";
                labelPorTrim.style.setProperty("margin-bottom","0px");
                selectTrimestres.setAttribute("id","selectTrim");
                        //Options de los trimestres
                        let optionTodosMeses = document.createElement("option");
                            optionTodosMeses.value = "Todos";
                            optionTodosMeses.text = "Todos";
                        let optionEnMarz = document.createElement("option");
                            optionEnMarz.value = "Ene-Mar";
                            optionEnMarz.text = "Ene-Mar";
                        let optionAbJun = document.createElement("option");
                            optionAbJun.value = "Abr-Jun";
                            optionAbJun.text = "Abr-Jun";
                        let optionJulSep = document.createElement("option");
                            optionJulSep.value = "Jul-Sep";
                            optionJulSep.text = "Jul-Sep";
                        let optionOctDic = document.createElement("option");
                            optionOctDic.value = "Oct-Dic";
                            optionOctDic.text = "Oct-Dic";
                selectTrimestres.appendChild(optionTodosMeses);
                selectTrimestres.appendChild(optionEnMarz);
                selectTrimestres.appendChild(optionAbJun);
                selectTrimestres.appendChild(optionJulSep);
                selectTrimestres.appendChild(optionOctDic);
                formGroupSelectTrimestres.setAttribute("class","form-group");
                formGroupSelectTrimestres.appendChild(labelPorTrim);
                formGroupSelectTrimestres.appendChild(selectTrimestres);
                divSelectTrimestres.appendChild(formGroupSelectTrimestres);
            divFilter.appendChild(divBotonFiltrar);
                botonFiltrar.innerHTML = "Filtrar";
                botonFiltrar.setAttribute("class","btn btn-success");
                botonFiltrar.setAttribute("id","btnFiltrar");
                botonFiltrar.style.setProperty("margin-bottom","-5px");
                botonFiltrar.setAttribute("onclick","actionFiltrar();");
                formGroupBoton.setAttribute("class","form-group d-flex align-items-center justify-content-center mb-0");
                formGroupBoton.appendChild(botonFiltrar);
                divBotonFiltrar.appendChild(formGroupBoton);               
        registrosNum.parentNode.insertBefore(divFilter,registrosNum.nextSibling);
        buscar.setAttribute("class","col-sm-12 col-md-3 d-flex align-items-center justify-content-center pt-2");
    });
}

function actionFiltrar(){
    let añoBuscar = document.getElementById("selectAño").value;
    let trimBuscar = document.getElementById("selectTrim").value;

    $.ajax({
        method : "post",
        url: "php/obtenerEventosResumen.php",
        data: {
          action : "filtrarTabla",
          añoBuscar : añoBuscar,
          trimBuscar : trimBuscar,
          añosTotales : años   
        },
        success: function( result ) {
            let resultadoJSON = JSON.parse(result);
            let tablaResumen = $("#tablaDatosEvento").DataTable();
            tablaResumen.clear();
            tablaResumen.draw();
            //Con el siguiente siclo forEach, recorremos el arreglo de los datos para agregarlos a la tabla
                resultadoJSON.evento.forEach(evento => {
                    let boolCapturado;    
                    if(evento.datoCapturado == 0){
                       boolCapturado = "No";
                    }else{
                       boolCapturado = "Si";
                    }    
                    btnMostrarEventoResumen = '<button type="button" class="btn btn-info" id = "botonCapturado'+evento.id+'" onclick = "identificarEstadoCapturado('+evento.id+');">Mostrar</button>';
                    //Agregamos los datos al renglon de la tabla
                    let fechaInicio = evento.inicio;
                    let fechaFin = evento.fin;
                    //Operacion para obtener fecha inicio
                        let yy = fechaInicio.substr(0,4);
                        fechaInicio = fechaInicio.substr(5);
                        let mm = fechaInicio.substr(0,2);
                        fechaInicio = fechaInicio.substr(3);
                        let dd = fechaInicio.substr(0,2);
                        fechaInicio = yy+"/"+mm+"/"+dd;
                     //Operacion para obtener fecha de fin
                        yy = fechaFin.substr(0,4);
                        fechaFin = fechaFin.substr(5);
                        mm = fechaFin.substr(0,2);
                        fechaFin = fechaFin.substr(3);
                        dd = fechaFin.substr(0,2);
                        fechaFin = yy+"/"+mm+"/"+dd;
                        
                    tablaResumen.row.add([
                        evento.nombre,
                        evento.tipo,
                        fechaInicio,
                        fechaFin,
                        boolCapturado,
                        btnMostrarEventoResumen
                    ]).draw().node().id= "row_"+evento.id;
                });
            if(resultadoJSON.estatus == 0){
                $(function() {
                    const Toast = Swal.mixin({
                      toast: true,
                      position: 'top-end',
                      showConfirmButton: false,
                      timer: 3000
                    });
      
                      Toast.fire({
                          type: 'info',
                          title: "Ningun evento encontrado!"
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
                          type: 'success',
                          title: "Eventos encontrados!"
                      })
      
                  });
            }
        }
    });
    
}

function ponerDatosModal(resultadoJSON){
    let contador = 0;
    arregloNombres.forEach(nombreDato =>{
        $("#tablaDatosModal").find('tbody').append( "<tr><td>"+nombreDato+"</td><td><i>"+resultadoJSON[contador]+"</i></td></tr>" );
        contador++;
    });
    $("#botonCapturado"+idEventoMostrar).removeClass("disabled");
    $('#modal-info').modal('show');//Al tener todo, mostramos el modal
}
