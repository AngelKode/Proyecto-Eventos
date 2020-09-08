<?php
	$servidor = "localhost";
	$usuario  = "root";
	$clave    = "";
	$base     = "tecweb2020";

	$conexion = mysqli_connect($servidor,$usuario,$clave,$base);
	mysql_set_charset($conexion,"utf-8");
?>
