<?php

$Respuesta=array();

if(isset($_POST['action'])){
	
	include "conexion.php";
	
	switch ($_POST['action']) {
		case 'read':
			ActionReadPHP($conexion);
			break;
		case 'update':
			ActionUpdatePHP($conexion);
			break;
		case 'create':
			ActionCreatePHP($conexion);
			break;
		case 'delete':
			ActionDeletePHP($conexion);
			break;	
		default:
			$Respuesta["estado"]=0;
			$Respuesta["mensaje"]="Accion no valida";
			echo json_encode($Respuesta);
			break;
	}

}else{
	$Respuesta["estado"]=0;
	$Respuesta["mensaje"]="Faltan Parametros";
	echo json_encode($Respuesta);
}

function ActionReadPHP($conexion){
	
	$Query = "SELECT * FROM tipo_evento";//Query a realizar
	
	$Respuesta["tipos_eventos"] = array();//Arreglo donde guardaremos los datos de la BD

	$Resultado 	= mysqli_query($conexion,$Query);//Guardamos el query obtenido

	while($Renglon = mysqli_fetch_array($Resultado)){//Mientras haya un renglón, seguimos guardando los datos en $Resultado

		$Tipo_Evento = array();
		$Tipo_Evento["id"] = $Renglon["ID"];
		$Tipo_Evento["nombre"] = $Renglon["Nombre"];
		$Tipo_Evento["observaciones"] = $Renglon["Observaciones"];

		array_push($Respuesta["tipos_eventos"], $Tipo_Evento);//Guardamos el dato de la BD en la posicion "tipos_eventos"
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

	$query = "DELETE FROM `tipo_evento` WHERE ID=".$idEliminar;
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

	$nombre = $_POST['nombre'];
	$observaciones = $_POST['observaciones'];
	$ID = $_POST['id'];

	$Respuesta['estado'] = 1;
	$Respuesta['mensaje'] = "Datos correctos";

	$query = "UPDATE tipo_evento SET Nombre='".$nombre."', Observaciones='".$observaciones."' WHERE ID =".$ID;
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

	$Query = "SELECT * FROM tipo_evento";//Query a realizar
	$ultimoId = 0;
	$Resultado 	= mysqli_query($conexion,$Query);//Guardamos el query obtenido

	while($Renglon = mysqli_fetch_array($Resultado)){//Mientras haya un renglón, seguimos ciclando
		$ultimoId = $Renglon['ID'];
	}
	$ultimoId = $ultimoId + 1; //Asi lo insertaremos al ultimo en la tabla
	//Ahora si, con el valor del ultimo ID, insertaremos el nuevo evento
	$eventoCrear = $_POST["nombre"];
	$observacionCrear = $_POST["observaciones"];

	$query = "INSERT INTO tipo_evento (`ID`, `Nombre`, `Observaciones`) VALUES ($ultimoId,'$eventoCrear','$observacionCrear')";
	$respuesta = mysqli_query($conexion,$query);
	$Respuesta = array();
	if(mysqli_affected_rows($conexion)>0){
		$Respuesta['estatus'] = 1;
		$Respuesta['ultimoID'] = $ultimoId;
	}else{
		$Respuesta['estatus'] = 0;
	}
	echo json_encode($Respuesta);

}

?>