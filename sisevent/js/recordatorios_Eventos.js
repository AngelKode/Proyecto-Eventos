
async function actionEnviarRecordatorio(){
    await ajaxEnviarCorreo()
    .then(()=>{
        toastr.success("Correos enviados correctamente");
    })
}

function ajaxEnviarCorreo(){
    toastr.info("Enviando correos...");
    return new Promise((resolve)=>{
        $.ajax({
            method  : "post",
            url     : "php/enviarCorreo.php",
            data    : {
                action : "sendEmail"
            }, success : function (result){
                alert(result);
                resolve();
            }
        })
    })
}

function actionEliminarRecordatorio(){
    $.ajax({
        method  : "post",
        url     : "php/crudRecordatorio.php",
        data    : {
            action : "delete"
        }, success : function (result){

            let resultJSON = JSON.parse(result);

            if(resultJSON.estatus == 1){
                toastr.success("Recordatorio eliminado");
                $("#divConRecordatorio").remove();
                $("#modalEliminarRecordatorio").modal('hide');
                let contenido = '<div class="d-flex justify-content-center" id="divSinRecordatorio"><img src="img/notFound.jpg" style="transform: scale(0.9);"></div><div><h4 style="display: block; text-align: center;margin-top: 1em;">Recordatorio Actual</h4><label style="display: block;text-align: center;">Actualmente no cuentas con un recordatorio. <a id="agregarRecordatorio"><em style="color:blue">Haz click aqui</em></a> para agregarlo</label></div>';
                $("#containerCentral").append(contenido);
                activarListeners();
            }else{
                toastr.error("Error al eliminar el recordatorio");
            }
        }
    })
}

function actionCambiarHora(){

    let horaNueva = $("#horarioEditar").val();
    let am_pm = horaNueva.substr(6);
    am_pm = am_pm.trim();
    horaNueva = horaNueva.substr(0,5);
    
        if(am_pm == "PM"){
            if(parseInt(horaNueva.substr(0,2)) != 12){
                let hora = (parseInt(horaNueva.substr(0,2)) + 12);
                let minutos = horaNueva.substr(3,2);
                horaNueva = hora+":"+minutos;
            }
        }else{
            if(parseInt(horaNueva.substr(0,2)) == 12){
                let hora = 0;
                let minutos = horaNueva.substr(3,2);
                horaNueva = hora+":"+minutos;
            }
        }

    $.ajax({
        method : "post",
        url    : "php/crudRecordatorio.php",
        data   : {
            action : "cambiarHorario",
            hora : horaNueva
        }, success : function(result){
            let resultJSON = JSON.parse(result);

                if(resultJSON.estatus == 1){
                    toastr.success("Horario actualizado correctamente");
                    $("#hora_Recordatorio").html(horaNueva);
                }else{
                    toastr.info("No se hicieron modificaciones");
                }
            $("#modalEditarHorario").modal('hide');
        }
    })
}

function actionCambiarFrecuencia(){
    let frecuencia = $("#selectFrecuencias option:selected").val();
    let frecuenciaString = $("#selectFrecuencias option:selected").text();
    let fecha = new Date();
    let fechaActual = fecha.getFullYear()+"-"+(fecha.getMonth() + 1)+"-"+fecha.getDate();

    $.ajax({
        method : "post",
        url    : "php/crudRecordatorio.php",
        data   : {
            action : "cambiarFrecuencia",
            frecuencia : frecuencia,
            fechaNueva : fechaActual
        }, success : function(result){
            let resultJSON = JSON.parse(result);

                if(resultJSON.estatus == 1){
                    toastr.success("Datos actualizados correctamente");
                    $("#frecuenciaForma").html(frecuenciaString);

                    let fechaInicio = new Date();

                    let stringFecha = "";
                    //Obtenemos la frecuencia
                    switch(frecuencia){
                        case '1':{
                            nombreFrecuencia = "Diario";
                            fechaInicio.setDate(fechaInicio.getDate() + 1);
                            stringFecha  = fechaInicio.getDate()+"/"+(fechaInicio.getMonth() + 1)+"/"+fechaInicio.getFullYear();
                            break;
                        }
                        case '2':{
                            nombreFrecuencia = "Semanal";
                            fechaInicio.setDate(fechaInicio.getDate() + 7);
                            stringFecha  = fechaInicio.getDate()+"/"+(fechaInicio.getMonth() + 1)+"/"+fechaInicio.getFullYear();
                            break;
                        }
                        case '3':{
                            nombreFrecuencia = "Quincenal";
                            fechaInicio.setDate(fechaInicio.getDate() + 15);
                            stringFecha  = fechaInicio.getDate()+"/"+(fechaInicio.getMonth() + 1)+"/"+fechaInicio.getFullYear();
                            break;
                        }
                        case '4':{
                            nombreFrecuencia = "Mensual";
                            fechaInicio.setMonth(fechaInicio.getMonth() + 1);
                            stringFecha  = fechaInicio.getDate()+"/"+(fechaInicio.getMonth() + 1)+"/"+fechaInicio.getFullYear();
                        }
                    }
                    $("#proxRecord").html("Próximo recordatorio: "+stringFecha);

                }else{
                    toastr.info("No se hicieron modificaciones");
                }
            $("#modalEditarFrecuencia").modal('hide');
        }
    })

}

async function actionCambiarEstructuraMensaje(){

    let mensaje = $("#mensajeEditar").val();
    let remitente = $("#remitenteEditar").val();
    let nombreRemitente = $("#nombreRemitenteEditar").val();
    let passwd = $("#contraseniaEditar").val();
    let smtp = $("#smtpCorreo").val();
    if(mensaje == "" || remitente == "" || nombreRemitente == "" || passwd == "" || smtp == ""){
        toastr.warning("Faltan campos. Verifiquelos");
    }else{
        $.ajax({
            method : "post",
            url    : "php/crudRecordatorio.php",
            data   : {
                action : "cambiarEstructuraMensaje",
                mensaje : mensaje,
                remitente : remitente,
                contra     : passwd,
                nombreRem  : nombreRemitente,
                smtp : smtp
            }, success : function(result){
                
                let resultJSON = JSON.parse(result);

                    if(resultJSON.estatus == 1){
                        toastr.success("Datos actualizados correctamente");

                    }else{
                        toastr.info("No se hicieron modificaciones");
                    }
                $("#modalEditarMensaje").modal('hide');
            }
        })
    }
}

function obtenerDatosBD(){
    return new Promise((resolver,rechazar)=>{
        $.ajax({
            method : "post",
            url    : "php/crudRecordatorio.php",
            data   : {
                action : "obtenerDatosEstructuraMensaje"
            }, success : function(result){

                let resultJSON = JSON.parse(result);

                if(resultJSON.estatus == 1){
                    $("#mensajeEditar").val(resultJSON.mensaje);
                    $("#remitenteEditar").val(resultJSON.remitente);
                    $("#nombreRemitenteEditar").val(resultJSON.nombreRemitente);
                    $("#contraseniaEditar").val(resultJSON.passwd);
                    $("#smtpCorreo").val(resultJSON.smtp);
                    resolver();
                }else{
                    rechazar();
                }

            }
        })
    })
}

function obtenerHorario(){
    return new Promise((resolver,rechazar)=>{
        $.ajax({
            method : "post",
            url    : "php/crudRecordatorio.php",
            data   : {
                action : "obtenerHorario"
            }, success : function(result){

                let resultJSON = JSON.parse(result);

                if(resultJSON.estatus == 1){
                    $("#horarioEditar").val(resultJSON.hora);
                    resolver();
                }else{
                    rechazar();
                }

            }
        })
    })
}

function obtenerFrecuencia(){
    return new Promise((resolver,rechazar)=>{
        $.ajax({
            method : "post",
            url    : "php/crudRecordatorio.php",
            data   : {
                action : "obtenerFrecuencia"
            }, success : function(result){

                let resultJSON = JSON.parse(result);

                if(resultJSON.estatus == 1){
                    
                    $("#selectFrecuencias option:selected").removeAttr('selected');
                    $("#selectFrecuencias option[value='"+resultJSON.frecuencia+"']").attr("selected","true");  
                    resolver();
                }else{
                    rechazar();
                }

            }
        })
    })
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
    //Leemos los datos del recordatorio
    $.ajax({
        method : "POST",
        url    : "php/crudRecordatorio.php",
        data   : {
            action : "read"
        }, success : function(result){

            let resultJSON = JSON.parse(result);
                if(resultJSON.estatus == 1){

                    let mensaje = resultJSON.mensaje;
                    let horario = resultJSON.horario;
                    horario = horario.substr(0,5);
                    let frecuencia = resultJSON.frecuencia;
                    let nombreFrecuencia = "";

                    //Obtenemos la fecha de inicio del recordatorio
                    let fechaInicio = new Date();
                    fechaInicio.setDate(resultJSON.dia);
                    fechaInicio.setMonth(resultJSON.mes);
                    fechaInicio.setFullYear(resultJSON.anio);

                    let fechaSiguienteRecordatorio = new Date();
                    let stringFecha = "";
                    //Obtenemos la frecuencia
                    switch(frecuencia){
                        case '1':{
                            nombreFrecuencia = "Diario";
                            fechaSiguienteRecordatorio.setDate(fechaInicio.getDate() + 1);
                            stringFecha  = fechaSiguienteRecordatorio.getDate()+"/"+(fechaSiguienteRecordatorio.getMonth() + 1)+"/"+fechaSiguienteRecordatorio.getFullYear();
                            break;
                        }
                        case '2':{
                            nombreFrecuencia = "Semanal";
                            fechaSiguienteRecordatorio.setDate(fechaInicio.getDate() + 7);
                            stringFecha  = fechaSiguienteRecordatorio.getDate()+"/"+(fechaSiguienteRecordatorio.getMonth() + 1)+"/"+fechaSiguienteRecordatorio.getFullYear();
                            break;
                        }
                        case '3':{
                            nombreFrecuencia = "Quincenal";
                            fechaSiguienteRecordatorio.setDate(fechaInicio.getDate() + 15);
                            stringFecha  = fechaSiguienteRecordatorio.getDate()+"/"+(fechaSiguienteRecordatorio.getMonth() + 1)+"/"+fechaSiguienteRecordatorio.getFullYear();
                            break;
                        }
                        case '4':{
                            nombreFrecuencia = "Mensual";
                            fechaSiguienteRecordatorio.setMonth(fechaInicio.getMonth() + 1);
                            stringFecha  = fechaSiguienteRecordatorio.getDate()+"/"+(fechaSiguienteRecordatorio.getMonth())+"/"+fechaSiguienteRecordatorio.getFullYear();
                        }
                    }
                     //Obtenemos la frecuencia
                    
                    let contenido = '<div class="row align-items-center" id="divConRecordatorio"><div class="d-flex justify-content-center align-items-center flex-column col"><div><em><h4 style="display: block; text-align: center;font-size:1.7rem;">Recordatorio Actual</h4></em></div><div class="row mt-4 w-100"><div class="col-6"><div class="row"><div class="col-sm-6 p-0"><div class="small-box bg-info m-2"><div class="inner"><h5 style="display: inline-block;">Frecuencia</h5><p id="frecuenciaForma">'+nombreFrecuencia+'</p><p id="proxRecord">Próximo recordatorio: '+stringFecha+'</p></div><div class="icon"><i class="far fa-calendar-alt fa-lg"></i></div><a id = "editarFrecuencia" class="small-box-footer">Editar</a></div></div><div class="col-sm-6 p-0" style="display: flex;"><div class="small-box bg-info m-2 w-100"><div class="inner"><h5 style="display: inline-block;">Horario</h5><p style="margin-bottom: 1rem;" id="hora_Recordatorio">'+horario+'</p></div><div class="icon"><i class="far fa-clock fa-lg"></i></div><a id="editarHorario" class="small-box-footer" style="position: absolute; bottom: 0;width: 100%;">Editar</a></div> </div></div><div class="row"><div class="col-sm-6 p-0"><div class="small-box bg-success m-2"><div class="inner"><h5 style="display: inline-block;">Enviar Recordatorio</h5><i class="far fa-paper-plane fa-lg float-right" style="padding-top: 0.5rem;"></i></div><a id = "enviarRecordatorio"  class="small-box-footer">Enviar</a></div></div><div class="col-sm-6 p-0"><div class="small-box bg-danger m-2"><div class="inner"><h5 style="display: inline-block;">Eliminar recordatorio</h5> <i class="fas fa-trash-alt fa-lg float-right" style="color:white;padding-top: 0.4rem;"></i></div><a id="eliminarRecordatorio" class="small-box-footer">Eliminar</a></div></div></div></div><div class="col-6" style="display: flex; justify-content: center; align-items: stretch;"><div class="small-box bg-info m-2 flex-fill"><div class="inner"><h5 style="display: inline-block;">Mensaje</h5><p style="text-align: justify;padding: .8rem;">'+mensaje+'</p></div><div class="icon"><i class="far fa-envelope-open fa-lg" style="opacity: 0.5;"></i></div><a id="editarMensaje" class="small-box-footer" style="position: absolute; bottom: 0;width: 100%;">Editar</a></div></div></div></div></div>';
                    $("#containerCentral").append(contenido);
                    activarListeners();
                }else{
                    let contenido = '<div class="d-flex justify-content-center" id="divSinRecordatorio"><img src="img/notFound.jpg" style="transform: scale(0.9);"></div><div id="subDivSinRecordatorio"><h4 style="display: block; text-align: center;margin-top: 1em;">Recordatorio Actual</h4><label style="display: block;text-align: center;">Actualmente no cuentas con un recordatorio. <a id="agregarRecordatorio"><em style="color:blue">Haz click aqui</em></a> para agregarlo</label></div>';
                    $("#containerCentral").append(contenido);
                    activarListeners();
                }
        }
    })
}

function actionCrearRecordatorio(){
    
    let mensaje = $("#mensajeRecordatorioNuevo").val();
    let horario = $("#horarioAgregar").val();
    let am_pm = horario.substr(6);
    am_pm = am_pm.trim();
    horario = horario.substr(0,5);
    
        if(am_pm == "PM"){
            if(parseInt(horario.substr(0,2)) != 12){
                let hora = (parseInt(horario.substr(0,2)) + 12);
                let minutos = horario.substr(3,2);
                horario = hora+":"+minutos;
            }
        }else{
            if(parseInt(horario.substr(0,2)) == 12){
                let hora = 0;
                let minutos = horario.substr(3,2);
                horario = hora+":"+minutos;
            }
        }
    let frecuencia = $("#frecuenciaAgregar option:selected").val();
    let fecha = new Date();
    let fechaActual = fecha.getFullYear()+"-"+(fecha.getMonth() + 1)+"-"+fecha.getDate();
    let smtpNuevo = $("#smtpCorreoNuevo").val();
    let remitente = $("#remitenteNuevo").val();
    let contra = $("#contraseniaNuevo").val();
    let nombreRemitente = $("#nombreRemitenteNuevo").val();

    if(mensaje == "" || horario == "" || smtpNuevo == "" || remitente == "" || contra == "" || nombreRemitente == ""){
        toastr.warning("Faltan campos. Verfifíquelos!");
    }else{

        $.ajax({
            method : "POST",
            url    : "php/crudRecordatorio.php",
            data   : {
                action  : "create",
                mensaje : mensaje,
                horario : horario,
                fechaInicio : fechaActual,
                frecuencia : frecuencia,
                smtp  : smtpNuevo,
                remitente : remitente,
                passwd  : contra,
                nombre : nombreRemitente
            }, success : function (result){
                let resultJSON = JSON.parse(result);
                let proximaFecha = new Date();
                let fechaString;
                let nombreFrecuencia = "";

                    if(frecuencia == 1){
                        nombreFrecuencia = "Diario";
                        proximaFecha.setDate(proximaFecha.getDate() + 1);
                        fechaString = proximaFecha.getDate()+"/"+(proximaFecha.getMonth() + 1)+"/"+proximaFecha.getFullYear();
                    }else if(frecuencia == 2){
                        nombreFrecuencia = "Semanal";
                        proximaFecha.setDate(proximaFecha.getDate() + 7);
                        fechaString = proximaFecha.getDate()+"/"+(proximaFecha.getMonth() + 1)+"/"+proximaFecha.getFullYear();
                    }else if(frecuencia == 3){
                        nombreFrecuencia = "Quincenal";
                        proximaFecha.setDate(proximaFecha.getDate() + 15);
                        fechaString = proximaFecha.getDate()+"/"+(proximaFecha.getMonth() + 1)+"/"+proximaFecha.getFullYear();
                    }else{
                        nombreFrecuencia = "Mensual";
                        proximaFecha.setMonth(proximaFecha.getMonth() + 1);
                        fechaString = proximaFecha.getDate()+"/"+(proximaFecha.getMonth())+"/"+proximaFecha.getFullYear();
                    }

                if(resultJSON.estatus == 1){
                    $("#divSinRecordatorio").remove();
                    $("#subDivSinRecordatorio").remove();
                    let contenido = '<div class="row align-items-center" id="divConRecordatorio"><div class="d-flex justify-content-center align-items-center flex-column col"><div><em><h4 style="display: block; text-align: center;font-size:1.7rem;">Recordatorio Actual</h4></em></div><div class="row mt-4 w-100"><div class="col-6"><div class="row"><div class="col-sm-6 p-0"><div class="small-box bg-info m-2"><div class="inner"><h5 style="display: inline-block;">Frecuencia</h5><p id="frecuenciaForma">'+nombreFrecuencia+'</p><p id="proxRecord">Próximo recordatorio: '+fechaString+'</p></div><div class="icon"><i class="far fa-calendar-alt fa-lg"></i></div><a id = "editarFrecuencia" class="small-box-footer">Editar</a></div></div><div class="col-sm-6 p-0" style="display: flex;"><div class="small-box bg-info m-2 w-100"><div class="inner"><h5 style="display: inline-block;">Horario</h5><p style="margin-bottom: 1rem;" id="hora_Recordatorio">'+horario+'</p></div><div class="icon"><i class="far fa-clock fa-lg"></i></div><a id="editarHorario" class="small-box-footer" style="position: absolute; bottom: 0;width: 100%;">Editar</a></div> </div></div><div class="row"><div class="col-sm-6 p-0"><div class="small-box bg-success m-2"><div class="inner"><h5 style="display: inline-block;">Enviar Recordatorio</h5><i class="far fa-paper-plane fa-lg float-right" style="padding-top: 0.5rem;"></i></div><a id = "enviarRecordatorio"  class="small-box-footer">Enviar</a></div></div><div class="col-sm-6 p-0"><div class="small-box bg-danger m-2"><div class="inner"><h5 style="display: inline-block;">Eliminar recordatorio</h5> <i class="fas fa-trash-alt fa-lg float-right" style="color:white;padding-top: 0.4rem;"></i></div><a id="eliminarRecordatorio" class="small-box-footer">Eliminar</a></div></div></div></div><div class="col-6" style="display: flex; justify-content: center; align-items: stretch;"><div class="small-box bg-info m-2 flex-fill"><div class="inner"><h5 style="display: inline-block;">Mensaje</h5><p style="text-align: justify;padding: .8rem;">'+mensaje+'</p></div><div class="icon"><i class="far fa-envelope-open fa-lg" style="opacity: 0.5;"></i></div><a id="editarMensaje" class="small-box-footer" style="position: absolute; bottom: 0;width: 100%;">Editar</a></div></div></div></div></div>';
                    $("#containerCentral").append(contenido);
                    activarListeners();
                    toastr.success("Recordatorio creado exitósamente");
                    $("#modalAgregarRecordatorio").modal('hide');
                }else{
                    toastr.error("Error al crear el recordatorio");
                    $("#modalAgregarRecordatorio").modal('hide');
                }
            }
        })
    }
}
function activarListeners(){
        //Cuando da click en editar la frecuencia del recordatorio
$("#editarFrecuencia").on('click',async () =>{
    await obtenerFrecuencia();
    $("#modalEditarFrecuencia").modal("show");
})

//Cuando da click en editar el horario del recordatorio
$("#editarHorario").on('click',async () =>{
    await obtenerHorario();
    $("#modalEditarHorario").modal("show");
})

//Cuando da click en editar el mensaje del recordatorio
$("#editarMensaje").on('click',async ()=> {
    await obtenerDatosBD();
    $("#modalEditarMensaje").modal('show');
})

//Cuando da click en enviar el mensaje del recordatorio
$("#enviarRecordatorio").on('click',()=> {
    $("#modalEnviarRecordatorio").modal('show');
})

//Cuando da click en eliminar el mensaje del recordatorio
$("#eliminarRecordatorio").on('click',()=> {
    $("#modalEliminarRecordatorio").modal('show');
})

$("#agregarRecordatorio").on('click',()=>{
    $("#modalAgregarRecordatorio").modal('show');
})
}
