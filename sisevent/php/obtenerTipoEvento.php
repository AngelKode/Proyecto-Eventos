<?php

$Respuesta=array();
	
	include "conexion.php";
	ActionReadPHP($conexion);

function ActionReadPHP($conexion){
	
	$Query = "SELECT * FROM tipo_evento";//Query a realizar
	
	$Respuesta["tipos_eventos"] = array();//Arreglo donde guardaremos los datos de la BD

	$Resultado 	= mysqli_query($conexion,$Query);//Guardamos el query obtenido

	while($Renglon = mysqli_fetch_array($Resultado)){//Mientras haya un renglón, seguimos guardando los datos en $Resultado

		$Tipo_Evento = array();
		$Tipo_Evento["nombre"] = $Renglon["Nombre"];
		$Tipo_Evento['idEvento'] = $Renglon['ID'];

		array_push($Respuesta["tipos_eventos"], $Tipo_Evento);//Guardamos el dato de la BD en la posicion "tipos_eventos"
	}
	$Respuesta["estado"] = 1;
	$Respuesta["mensaje"] = "Consulta exitosa";

	echo json_encode($Respuesta);//Mandamos los datos obtenidos
	//echo $aux;
}



?>