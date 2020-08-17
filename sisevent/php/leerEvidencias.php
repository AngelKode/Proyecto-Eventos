<?php
   include 'conexion.php'; 	
   $idObtener = $_POST['id'];
   $query = "SELECT * FROM evidencias WHERE id=".$idObtener.";";
   $resultado = mysqli_query($conexion,$query);

   $numeroRenglones = mysqli_num_rows($resultado);

   if($numeroRenglones > 0){
   	  $Renglon = mysqli_fetch_array($resultado);
   	  $Respuesta = array();
      $Respuesta['numHombres'] = $Renglon['numHombres'];
      $Respuesta['numMujeres'] = $Renglon['numMujeres'];
      $Respuesta['numExpositores'] = $Renglon['numExpositores'];
      $Respuesta['pormenores'] = $Renglon['pormenores'];
      $Respuesta['imagen1'] = $Renglon['evidencia1'];
      $Respuesta['imagen2'] = $Renglon['evidencia2'];
      $Respuesta['estatus'] = 1;
      echo json_encode($Respuesta);
   }else{
   	$Respuesta = array();
   	$Respuesta['estatus'] = 0;
   	echo json_encode($Respuesta);
   }
?>