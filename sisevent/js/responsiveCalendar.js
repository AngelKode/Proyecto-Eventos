//Agregando las clases para hacer responsive FullCalendar
$(function(){

      //Primero agregamos la clase row, para hacer los 3 divs responsive
      $('.fc-toolbar.fc-header-toolbar').addClass('row');

      //Luego agregamos la clase col-sm-4, porque en total son 12 filas, a los 3 divs
          //Para pantallas pequeñas
              $('.fc-left').addClass('col-sm');
              $('.fc-center').addClass('col-sm');
              $('.fc-right').addClass('col-sm');
          //Para pantallas medianas
              $('.fc-left').addClass('col-md');
              $('.fc-center').addClass('col-md');
              $('.fc-right').addClass('col-md');
          //Para pantallas grandes
              $('.fc-left').addClass('col-lg');
              $('.fc-center').addClass('col-lg');
              $('.fc-right').addClass('col-lg');
          //Para pantallas muy grandes
              $('.fc-left').addClass('col-xl align-items-center p-2');
              $('.fc-center').addClass('col-xl align-items-center p-2');
              $('.fc-right').addClass('col-xl align-items-center p-2');
    
    //Por ultimo, centramos los elementos
    $('.fc-left').addClass('d-flex justify-content-center');
    $('.fc-center h2').css("text-align","center");
    $('.fc-right').addClass('d-flex justify-content-center');

})