<?php

include 'conexion.php';
$Respuesta = array();
ActionReadPHP($conexion);

function ActionReadPHP($conexion){

    $Query = "SELECT * FROM categoria";//Query a realizar
	
	$Respuesta["categorias"] = array();//Arreglo donde guardaremos los datos de la BD

	$Resultado 	= mysqli_query($conexion,$Query);//Guardamos el query obtenido

	while($Renglon = mysqli_fetch_array($Resultado)){//Mientras haya un renglón, seguimos guardando los datos en $Resultado

		$Categorias = array();
		$Categorias["nombre"] = $Renglon["Nombre"];

		array_push($Respuesta["categorias"], $Categorias);//Guardamos el dato de la BD en la posicion "categorias"
	}
	$Respuesta["estado"] = 1;
	$Respuesta["mensaje"] = "Consulta exitosa";

	echo json_encode($Respuesta);//Mandamos los datos obtenidos

}


?>