<?php

	include 'conexion.php';

	$todo	= array();
	$res 	= mysqli_query($conexion, "SELECT * FROM eventos");
	$todo = array();

	while ($renglon = mysqli_fetch_array($res)) {
		$arr = array();

		$arr['start']		= 	$renglon['inicio'];
		$arr['endDate']			= 	$renglon['final'];
		$arr['title']		= 	$renglon['titulo'];
		//Obtenemos el id, y lo buscamos en la tabla
			$idTipoEvento 		= 	$renglon['tipoEv'];
			$query 				= 	"SELECT * FROM tipo_evento WHERE ID = ".$idTipoEvento;
			$respuesta 			= 	mysqli_query($conexion,$query);
			$tipoEventoObtenido = 	mysqli_fetch_array($respuesta);
		$arr['tipoEv']		=	$tipoEventoObtenido['Nombre'];
		$arr['publico']		= 	$renglon['publico'];
		$arr['description']	= 	$renglon['descripcion'];
		$arr['modalidad']   = 	$renglon['modalidad'];
		$arr['costo']		=   $renglon['costoEvento'];
		$arr['horas']		=   $renglon['cantidadHoras'];
		$arr['idEvento']	= 	$renglon['idEvento'];

		array_push($todo, $arr);
	}
	echo json_encode($todo);//Mandamos los datos obtenidos
	//echo $aux;
?>