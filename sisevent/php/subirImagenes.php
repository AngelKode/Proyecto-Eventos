<?php
    $nombre = uniqid();
	if (($_FILES["file"]["type"] == "image/pjpeg")
    || ($_FILES["file"]["type"] == "image/jpeg")
    || ($_FILES["file"]["type"] == "image/png")
    || ($_FILES["file"]["type"] == "image/gif")) {
      if (move_uploaded_file($_FILES["file"]["tmp_name"], "../img/".$nombre."-".$_FILES['file']['name'])) {
      	include 'conexion.php';
      	$nombreIm = $nombre."-".$_FILES['file']['name'];
      	$id = $_POST['ID'];
        //Eliminando la imagen anterior, para evitar tener la misma foto
        //pero con diferente nombre
         $query = "SELECT * FROM evidencias WHERE id =".$id.";";
         $resultado = mysqli_query($conexion, $query);
         $Renglon = mysqli_fetch_array($resultado);
         if($Renglon['evidencia1'] != ""){
          $imagen = $Renglon['evidencia1'];
          unlink("../img/".$imagen);
         }     
        //Eliminando la imagen anterior, para evitar tener la misma foto
        //pero con diferente nombre
         
      	$query = "UPDATE evidencias SET evidencia1 = '$nombreIm' WHERE id =".$id.";";
      $Respuesta = array();  
	    $resultado = mysqli_query($conexion,$query);

	  	if(mysqli_affected_rows($conexion)>0){
	  		$Respuesta['estatus'] = 1;
	  	}else{
	  		$Respuesta['estatus'] = 2;
	  	}
       } else {
          $Respuesta['estatus'] = -2;
       }
 
    }else {
      $Respuesta['estatus'] = -1;
    }
	 echo json_encode($Respuesta);
?>