<?php

	include 'conexion.php';

	$todo	= array();
	$res 	= mysqli_query($conexion, "SELECT * FROM eventos");
	$todo = array();

	while ($renglon = mysqli_fetch_array($res)) {
		$arr = array();

		$arr['start']		= 	$renglon['inicio'];
		$arr['end']			= 	$renglon['final'];
		$arr['title']		= 	$renglon['titulo'];
		$arr['tipoEv']		= 	$renglon['tipoEv'];
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