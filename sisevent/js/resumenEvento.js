let idEstadoCapturadoEvento = 0;
let años = Array();

function actionRead(){

     //-----------------------------------Checar sesion---------------------------------------------
     let nombreUsuario = sessionStorage.getItem("data");//Obtenemos el valor del session storage

     //Validamos los permisos de sesión
     if(nombreUsuario != null && nombreUsuario == "Admin"){
       $("#nombreUsuario").text("Bienvenido "+nombreUsuario);
     }else{
       if(nombreUsuario == null){
           alert("Su sesión ha expirado, inicie de nuevo su sesion!");
           window.location.replace("login.html");
       }else{
           alert("No tiene permiso para ingresar!. Será redireccionado");
           window.location.replace("Calendario.html");
       }  
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
                    
                    if(evento.datoCapturado == 0){
                        btnEventoCapturado = '<button type="button" class="btn btn-outline-warning" id = "botonCapturado'+evento.id+'" onclick = "identificarEstadoCapturado('+evento.id+');">No</button>';
                    }else{
                        btnEventoCapturado = '<button type="button" class="btn btn-outline-success" id = "botonCapturado'+evento.id+'" onclick = "identificarEstadoCapturado('+evento.id+');">Si</button>';
                    }    
                    
                    //Checar si tiene # de registro
                    let numRegistro;
                    if(evento.numRegistro == ""){
                        numRegistro = "N/A";
                    }else{
                        numRegistro = evento.numRegistro;
                    }
                    
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

                        //Checamos si el evento tiene evidencias o no
                        let cantidadMujeres,cantidadHombres;
                        if(evento[0] === undefined){
                            cantidadHombres = "S/E";
                            cantidadMujeres = "S/E";
                        }else{
                            cantidadHombres = evento[0].cantidadHombres;
                            cantidadMujeres = evento[0].cantidadMujeres;
                        }


                        tablaResumen.row.add([
                            evento.nombre,
                            evento.modalidad,
                            evento.tipo,
                            evento.rama,
                            evento.duracion,
                            numRegistro,
                            fechaInicio,
                            fechaFin,
                            cantidadHombres,
                            cantidadMujeres,
                            evento.formaPago,
                            evento.instanciaAtendida,
                            evento.capacitador,
                            btnEventoCapturado
                        ]).draw().node().id= "row_"+evento.id;
                });
                años = [...new Set(años)]//Eliminamos repetidos
                crearElementosFiltrar();
        }
    });
}

function identificarEstadoCapturado(idEvento){

    idEstadoCapturadoEvento = idEvento;
    let botonEstatus = "botonCapturado"+idEstadoCapturadoEvento;
    let botonDom = document.getElementById(botonEstatus);
    let estadoActual = "";
    let estadoSiguiente = "";

    if(botonDom.textContent == "Si"){//Con .textContent obtenemos si "Si" o "No"
      estadoActual = "btn btn-outline-success";
      estadoSiguiente = "btn btn-outline-warning";
      botonDom.textContent = "No";
    }else{
      estadoActual = "btn btn-outline-warning";
      estadoSiguiente = "btn btn-outline-success";
      botonDom.textContent = "Si";
    }

    let jquery = "#"+botonEstatus;//Texto que nos sirve para detectar el objeto con la id usando jquery para luego usarlo
    $(jquery).removeClass(estadoActual).addClass(estadoSiguiente);//Removemos la clase del boton y le agreamos otra

    actualizarEstadoCapturado(botonDom.textContent);//Usamos ajax para actualizar el estado
}

function actualizarEstadoCapturado(estadoNuevo){

    let nuevoEstado;
    
    if(estadoNuevo == "Si"){
        nuevoEstado = 1;
    }else{
        nuevoEstado = 0;
    }
    
    $.ajax({
        method : "post",
        url: "php/obtenerEventosResumen.php",
        data: {
          action : "actualizarCapturado",
          estado : nuevoEstado,
          id : idEstadoCapturadoEvento
        },
        success: function( result ) {
            let resultadoJSON = JSON.parse(result);
    
            if(resultadoJSON.estado == 1){//Si vale 1, quiere decir que se actualizo correctamente el estado del usuario
                $(function() {
                  const tabla = $("#tablaDatosEvento").DataTable();
                  const renglon = tabla.row("#row_"+idEstadoCapturadoEvento).data();
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

                    if(evento.datoCapturado == 0){
                        btnEventoCapturado = '<button type="button" class="btn btn-outline-warning" id = "botonCapturado'+evento.id+'" onclick = "identificarEstadoCapturado('+evento.id+');">No</button>';
                    }else{
                        btnEventoCapturado = '<button type="button" class="btn btn-outline-success" id = "botonCapturado'+evento.id+'" onclick = "identificarEstadoCapturado('+evento.id+');">Si</button>';
                    }    
                    
                    //Checar si tiene # de registro
                    let numRegistro;
                    if(evento.numRegistro == ""){
                        numRegistro = "N/A";
                    }else{
                        numRegistro = evento.numRegistro;
                    }
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
                        evento.modalidad,
                        evento.tipo,
                        evento.rama,
                        evento.duracion,
                        numRegistro,
                        fechaInicio,
                        fechaFin,
                        evento[0].cantidadHombres,
                        evento[0].cantidadMujeres,
                        evento.formaPago,
                        evento.instanciaAtendida,
                        evento.capacitador,
                        btnEventoCapturado
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