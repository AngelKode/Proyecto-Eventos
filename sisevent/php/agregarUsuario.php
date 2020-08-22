<?php

$Respuesta = array();

if(isset($_POST['action'])){

    include 'conexion.php';

    switch($_POST['action']){

        case 'create':

            actionCreatePHP($conexion);
            break;

        case 'read':

            actionReadPHP($conexion);
            break;

        case 'update':

            actionUpdatePHP($conexion);
            break;

        case 'delete':

            actionDeletePHP($conexion);
			break;
		case 'setEstatus':

			actionSetEstatusPHP($conexion);
			break;

    }
}else{
	$Respuesta["estado"]=0;
	$Respuesta["mensaje"]="Faltan Parametros";
	echo json_encode($Respuesta);
}

function ActionReadPHP($conexion){
	
	$Query = "SELECT * FROM usuarioeditor";//Query a realizar
	
	$Respuesta["usuario"] = array();//Arreglo donde guardaremos los datos de la BD

	$Resultado 	= mysqli_query($conexion,$Query);//Guardamos el query obtenido

	while($Renglon = mysqli_fetch_array($Resultado)){//Mientras haya un renglón, seguimos guardando los datos en $Resultado

		$Usuario = array();
		$Usuario["id"] = $Renglon["id"];
		$Usuario["nombre"] = $Renglon["Nombre_Editor"];
        $Usuario["correo"] = $Renglon["Correo_Editor"];
        $Usuario["celular"] = $Renglon["Celular_Editor"];
        $Usuario["usuario"] = $Renglon["Nombre_Usuario"];
        $Usuario["contraseña"] = $Renglon["Contraseña_Usuario"];
		$Usuario["editorMemInst"] = $Renglon["Editor_MemInstitucional"];
		$Usuario["estado"] = $Renglon["estado"];

		array_push($Respuesta["usuario"], $Usuario);//Guardamos el dato de la BD en la posicion "tipos_eventos"
	}
	$Respuesta["estado"] = 1;
	$Respuesta["mensaje"] = "Consulta exitosa";

	echo json_encode($Respuesta);//Mandamos los datos obtenidos
	//echo $aux;
}

function ActionDeletePHP($conexion){

	if(isset($_POST['id'])){//Verificando que el dato se leyó correctamente
		$idEliminar = $_POST['id'];
	}else{
		$Respuesta = array();
		$Respuesta['estatus'] = 0;
	}

	$query = "DELETE FROM `usuarioeditor` WHERE id=".$idEliminar;
	$resultado = mysqli_query($conexion,$query);

	$Respuesta = array();

	  if(mysqli_affected_rows($conexion)>0){
		 $Respuesta['estatus'] = 1;
	  }else{
		 $Respuesta['estatus'] = 0;
	  }

	echo json_encode($Respuesta);
}

function ActionUpdatePHP($conexion){

	$ID = $_POST['id'];
    $nombreUsuario = $_POST['nombre'];
    $correoUsuario = $_POST['correo'];
    $telefonoUsuario = $_POST['telefono'];
    $usuario = $_POST['usuario'];
    $contra = $_POST['passwrd'];
    $editor = $_POST['boolEditor'];

	$Respuesta['mensaje'] = "Datos correctos";

		$query = "UPDATE usuarioeditor SET Nombre_Editor='".$nombreUsuario."', Correo_Editor='".$correoUsuario."', 
				Celular_Editor = '".$telefonoUsuario."', Nombre_Usuario = '".$usuario."', 
				Contraseña_Usuario = '".$contra."', Editor_MemInstitucional = '".$editor."'
				WHERE id =".$ID;
		$res = mysqli_query($conexion,$query);

		if(mysqli_affected_rows($conexion)>0){
			$Respuesta['estado'] = 1;
			$Respuesta['mensaje'] = "Datos actualizados correctamente";
		}else{
			$Respuesta['estado'] = 0;
			$Respuesta['mensaje'] = "No se hicieron modificaciones";
		}
	

	echo json_encode($Respuesta);
    
}

function ActionCreatePHP($conexion){
	
	$Respuesta = array();
    $nombreUsuario = $_POST['nombre'];
    $correoUsuario = $_POST['correo'];
	$telefonoUsuario = $_POST['telefono'];
	$usuario = $_POST['usuarioCrear'];
    $contra = $_POST['passwrd'];
	$editor = $_POST['boolEditor'];
	$estado = "Activo";
	
		//Query para checar si hay correo repetido o no
			$query = "SELECT * FROM usuarioeditor WHERE Correo_Editor ='".$correoUsuario."'";
			$respuesta = mysqli_query($conexion,$query);
				if(mysqli_affected_rows($conexion)>0){
					$Respuesta['correoRepetido'] = "Si";
				}else{
					$Respuesta['correoRepetido'] = "No";
				}
		//Query para checaar si hay correo repetido o no

		//Query para checar si hay usuario repetido o no
			$query = "SELECT * FROM usuarioeditor WHERE Nombre_Usuario ='".$usuario."'";
			$respuesta = mysqli_query($conexion,$query);
				if(mysqli_affected_rows($conexion)>0){
					$Respuesta['usuarioRepetido'] = "Si";
				}else{
					$Respuesta['usuarioRepetido'] = "No";
				}
		//Query para checar si hay usuario repetido o no
	
	//Despues de checar si esta repetido el correo o el usuario, validamos si se puede o no hacer el query

	if($Respuesta['correoRepetido'] == "No" && $Respuesta['usuarioRepetido'] == "No"){
		$query = "INSERT INTO usuarioeditor (`Nombre_Editor`, `Correo_Editor`, `Celular_Editor`, 
											`Nombre_Usuario`, `Contraseña_Usuario`, `Editor_MemInstitucional`,
											`estado`) 
				VALUES ('$nombreUsuario','$correoUsuario','$telefonoUsuario','$usuario','$contra','$editor','$estado')";
		$respuesta = mysqli_query($conexion,$query);
		if(mysqli_affected_rows($conexion)>0){
			$result = mysqli_query($conexion,"SELECT MAX(id) AS id FROM usuarioeditor");//Obtenemos el id del ultimo usuario ingresado
			$dato = mysqli_fetch_assoc($result);//Obtenemos los datos de la fila encontrada

			$Respuesta['ultimoID'] = $dato['id'];//Obtenemos el ultimo id que lo tiene $dato en la posicion 'id'
			$Respuesta['estatus'] = 1;
		}else{
			$Respuesta['estatus'] = 0;
		}
	}
	echo json_encode($Respuesta);
}

function actionSetEstatusPHP($conexion){
	$Respuesta = array();
	$estado = $_POST['estado'];
	$id = $_POST['id'];
	$query = "UPDATE usuarioeditor SET estado='".$estado."'
			  WHERE id =".$id;
	$res = mysqli_query($conexion,$query);

	if(mysqli_affected_rows($conexion)>0){
		$Respuesta['estado'] = 1;
		$Respuesta['mensaje'] = "Datos actualizados correctamente";
	}else{
		$Respuesta['estado'] = 0;
		$Respuesta['mensaje'] = "No se hicieron modificaciones";
	}

   echo json_encode($Respuesta);		  
}

?>