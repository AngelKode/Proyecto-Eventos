<?php
	$servidor = "localhost";
	$usuario  = "root";
	$clave    = "";
	$base     = "tecweb2020";

	$conexion = mysqli_connect($servidor,$usuario,$clave,$base);
	mysqli_set_charset($conexion,"utf-8");
?>
