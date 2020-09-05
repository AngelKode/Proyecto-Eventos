function consultaEV(id){
  let laId = id;
  
  $.ajax({
        url: 'php/consultaEvi.php',
        type: 'post',
        data:{
          id : laId
        },
        success: function(response){
            var respuesta = response;
            if (respuesta=='1') {
              leerEvidencias(laId);
            }
            else{
              $('#sinEvidencias').modal();
            }
        }
  });
}

function leerEvidencias(id){
      let ev1 = document.getElementById('ev1');
      let ev2 = document.getElementById('ev2');
      idEvidencias = id;
    $.ajax({
        url: 'php/leerEvidencias.php',
        type: 'post',
        data:{
          id : idEvidencias,
        },
        success: function(response) {
         let respuesta = JSON.parse(response);

            if (respuesta.estatus != 0) {
              $('#onvre').html("<strong>Hombres</strong>"+respuesta.numHombres);
              $('#muhere').html("<strong>Mujeres</strong>"+respuesta.numMujeres);
              $('#patos').html("<strong>Expositores</strong>"+respuesta.numExpositores);
              $('#descripcionEv').html(respuesta.pormenores);
              
              if(respuesta.imagen1 != ""){
                let imagen1 = "img/"+respuesta.imagen1;
                ev1.setAttribute("src",imagen1);
              }
              if(respuesta.imagen2 != ""){
                 let imagen2 =  "img/"+respuesta.imagen2;
                 ev2.setAttribute("src",imagen2);
              }
              if(respuesta.imagen1 == ""){
                ev1.setAttribute("src","img/noImagen.jpeg");
              }
              if(respuesta.imagen2 == ""){
                 ev2.setAttribute("src","img/noImagen.jpeg");
              }
                $.ajax({
                     url: 'php/agregarEventoFecha.php',
                     type: 'post',
                     data:{
                       id : idEvidencias,
                       action : 'obtenerCostoHoras'
                     },
                      success: function(response) {
                        
                        let resultJSON = JSON.parse(response);
                        $("#costoEvid").html("$"+resultJSON.costoEvento);
                        $("#horasEvid").html(resultJSON.horasEvento);
                        
                        $('#conEvidencias').modal();
                      }
                });
              
            }else{
              document.getElementById('cantidadHombres').value = "";
              document.getElementById('cantidadMujeres').value = "";
              document.getElementById('cantidadExpo').value = "";
              document.getElementById('pormenores').value = "";
              ev1.setAttribute("src","");
              ev2.setAttribute("src","");
              $('#conEvidencias').modal();
            }
         }    
    });
}

function actionRead(){
  var nombreUsuario = sessionStorage.getItem("data");//Obtenemos el valor del session storage
  if(nombreUsuario != null){
    if(sessionStorage.getItem("admin") == "Si"){
      $("#nombreUsuario").text("Bienvenido "+nombreUsuario);
    }else{
      $("#linkAltaCategoria").remove();
      $("#linkAltaTipoEvento").remove();
      $("#linkAltaUsuarios").remove();
      $("#linkResumenEducacion").remove();
      $("#nombreUsuario").text("Bienvenido "+nombreUsuario);
    }
  }else{
    alert("Su sesión ha expirado, inicie de nuevo su sesion!");
    window.location.replace("login.html");
  }
  
}