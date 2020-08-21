
function log_In(){
	
	let correo_Usuario = document.getElementById('email').value;
	let contraseña = document.getElementById('contraseña').value;
	$.ajax({
		method : "POST",
		url: "php/login.php",
		data: {
		  email : correo_Usuario,
		  password : contraseña,
		  accion:"login"
		},
		success: function( result ) {
	 var resultado = JSON.parse(result);
	if(resultado.bd == 1){
			if(resultado.estatus == 1){
				window.location.replace("Calendario.html");
			}else{
			    $(function() {
					const Toast = Swal.mixin({
					  toast: true,
					  position: 'top-end',
					  showConfirmButton: false,
					  timer: 3000
					});
					Toast.fire({
						type: 'warning',
						title: 'E-mail y/o contraseña incorrectos!'
					  })
				});
			}
		  }else{
			alert("No se ha podido hacer la conexion a la base de datos!");
		  }
		}
	  });
	
}

function logout(){

    $.ajax({
        url: "php/login.php",
        data: {
          accion:"logout"
        },
        success: function( result ) {
            window.location.replace("login.html");
        }
      });
}




