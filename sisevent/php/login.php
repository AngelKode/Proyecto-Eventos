<?php
	include "conexion.php";
    

  if(isset($_POST["email"])){  
	$correo = $_POST["email"];
	$contraseña = $_POST["password"];
	$accion = $_POST["accion"];

    if(isset($correo) && isset($contraseña)){ 
		
         if($accion == "login"){
              LogIn();
         }else if($accion == "logout"){
              LogOut();
         }

    }else{

        $Respuesta = array();
        $Respuesta["estatus"] = 0;
        $Respuesta["mensaje"] = "Faltan parámetros";
        echo json_encode($Respuesta);
    }
 }
    function LogIn(){

        $Respuesta = array();
        $email = $_POST["email"];//Obteniendo el valor del email
        $pswrd = $_POST["password"];//Obteniendo el valor de la contraseña
        include "conexion.php"; 
        if($conexion){//Buena conexion a la BD
            $query = "SELECT * FROM administrador where usuario='$email' AND contraseña ='$pswrd'";//Query a hacer en la BD
            $buscarDatos = mysqli_query($conexion,$query);//Haciendo la consulta
            $Respuesta["bd"] = 1;

            if(mysqli_affected_rows($conexion) > 0){//Verificando que las credenciales fueron correctas!
                $renglon = mysqli_fetch_array($buscarDatos);
                $Respuesta["estatus"] = 1;
                $Respuesta['usuario'] = "Admin";
                $Respuesta['admin'] = "Si";
                $Respuesta["obtenido"] = $renglon["idadmin"];
                echo json_encode($Respuesta);
            }else{
                //Si no encontro en la BD de administrador, buscamos en la BD de usuarios editores
                $query = "SELECT * FROM usuarioeditor where Correo_Editor='$email' AND Contraseña_Usuario ='$pswrd'";//Query a hacer en la BD
                $buscarDatos = mysqli_query($conexion,$query);//Haciendo la consulta
                $Respuesta["bd"] = 1;

                if(mysqli_affected_rows($conexion) > 0){//Verificando que las credenciales fueron correctas!
                    $Respuesta["estatus"] = 1;
                    $renglon = mysqli_fetch_array($buscarDatos);
                    $Respuesta["usuario"] = $renglon["Nombre_Editor"];
                    $Respuesta['estado'] = $renglon["estado"];
                    $Respuesta["estatus"] = 1;
                    $Respuesta['admin'] = "No";
                    $Respuesta['obtenido'] = $renglon['id'];
                    $Respuesta['editorMemoria'] = $renglon['Editor_MemInstitucional'];
                }else{
                    $Respuesta["estatus"] = -1;
                    $Respuesta["mensaje"] = "Acceso denegado!";
                }

              echo json_encode($Respuesta);
            }
        }else{ //mala conexion a la BD

            $Respuesta["bd"] = 0;
            $Respuesta["estatus"] = 0;
            echo json_encode($Respuesta);

        }

    }

    function LogOut(){
        session_unset();
        session_destroy();
    }

    
?>