<?php 
include 'conexion.php';
$aidi = $_POST['id'];

$sql = "SELECT * FROM evidencias WHERE id =".$aidi;

$res = mysqli_query($conexion,$sql);
if(mysqli_affected_rows($conexion)>0){
	$es = '1';
}
else{
	$es = '0';
}

echo $es;

?>