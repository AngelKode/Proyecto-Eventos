<?php
if(isset($_POST['id'])){
	include 'conexion.php';
	$cantidadHombres = $_POST['hombres'];
	$cantidadMujeres = $_POST['mujeres'];
	$id = $_POST['id'];
	$expo = $_POST['expo'];
	$pormenores = $_POST['pormenores'];
    //-------------------------------------------------------
    //Query para crear la tabla si no existe
	 $query = "CREATE TABLE IF NOT EXISTS evidencias(
			id INT(6) AUTO_INCREMENT PRIMARY KEY,
			numHombres INT(6),
			numMujeres INT(6),
			numExpositores INT(6),
			pormenores varchar(150) NOT NULL,
			evidencia1 varchar(150) NOT NULL,
			evidencia2 varchar(150) NOT NULL
			)";
	mysqli_query($conexion, $query);//Hacemos el query a la BD
	//-----------------------------------------------------

	$query = "SELECT * FROM evidencias WHERE id =".$id.";";
	$resultado = mysqli_query($conexion, $query);
	//Con este query checamos la existencia del renglon con
	//el id del valor que pasamos por POST
	//-------------------------------------------------------
	$numeroRenglones = mysqli_num_rows($resultado);
	//Si vale 0, no existe, si vale 1, si existe
	//--------------------------------------------------------------------------------------------------------------
	if($numeroRenglones > 0){//Si si existe, actualizamos los datos
      $query = "UPDATE evidencias SET numHombres = $cantidadHombres, numMujeres = $cantidadMujeres, numExpositores = $expo, pormenores = '$pormenores' WHERE id =".$id.";";
	}else{//Si no existe, insertamos los datos
	  $query = "INSERT INTO evidencias (`id`, `numHombres`, `numMujeres`,`numExpositores`, `pormenores`) VALUES ($id,$cantidadHombres,$cantidadMujeres,$expo,'$pormenores')";
	}
       
     mysqli_query($conexion, $query);
     //------------------------------------------------------------------------------------------------------------

     $ultimoId =  mysqli_insert_id($conexion);
	  if(mysqli_affected_rows($conexion)>0){
	  	echo 1;
	  }else{
	  	echo -1;
	  }

   }
?>