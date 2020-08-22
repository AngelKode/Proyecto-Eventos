
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
						if(resultado.admin == "Si"){
							let nombreUsuario = resultado.usuario;
							sessionStorage.setItem("data",nombreUsuario);//Mandamos el dato al local storage
							sessionStorage.setItem("admin","Si");
							window.location.replace("Calendario.html");//Cambiamos de ventana
						}else{
							if(resultado.estado == "Activo"){
								//El usuario en esta condicion se encuentra activo, por lo que puede iniciar sesion
								//con normalidad
								sessionStorage.setItem("data",resultado.usuario);//Mandamos el dato al local storage
								window.location.replace("Calendario.html");//Cambiamos de ventana
								sessionStorage.setItem("admin","No");
							}else{
								//El usuario en esta condicion se encuentra inactivo, por lo que no podrá iniciar
								//hasta que el administrador lo active
								$(function() {
									const Toast = Swal.mixin({
									toast: true,
									position: 'top-end',
									showConfirmButton: false,
									timer: 3000
									});
									Toast.fire({
										type: 'warning',
										title: 'Su cuenta se encuentra inactiva, contacte al administrador'
									})
								});
							}
						}
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
			sessionStorage.removeItem("data");
			window.location.replace("login.html");
        }
      });
}




