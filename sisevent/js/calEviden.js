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
              $('#onvre').html(respuesta.numHombres);
              $('#muhere').html(respuesta.numMujeres);
              $('#patos').html(respuesta.numExpositores);
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
                ev1.setAttribute("src","");
              }
              if(respuesta.imagen2 == ""){
                 ev2.setAttribute("src","");
              }
              $('#conEvidencias').modal();
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
