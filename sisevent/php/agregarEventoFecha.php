<?php

$Respuesta=array();

if(isset($_POST['action'])){
	
	include "conexion.php";
	
	switch ($_POST['action']) {
		case 'read':
			ActionReadPHP($conexion);
			break;
		case 'update':
			ActionUpdatePHP($conexion);
			break;
		case 'create':
			ActionCreatePHP($conexion);
			break;
		case 'delete':
			ActionDeletePHP($conexion);
			break;
		case 'descripcion':
		    $id = $_POST['id'];
			ActionObtenerDescripcion($conexion,$id);
			break;		
		default:
			$Respuesta["estado"]=0;
			$Respuesta["mensaje"]="Accion no valida";
			echo json_encode($Respuesta);
			break;
	}

}else{
	$Respuesta["estado"]=0;
	$Respuesta["mensaje"]="Faltan Parametros";
	echo json_encode($Respuesta);
}

function ActionReadPHP($conexion){
	$creador = $_POST['creator'];
	$Query = "SELECT * FROM eventos WHERE usuarioCreador ='".$creador."'";//Query a realizar
	$Respuesta["eventos"] = array();//Arreglo donde guardaremos los datos de la BD

	$Resultado 	= mysqli_query($conexion,$Query);//Guardamos el query obtenido

	while($Renglon = mysqli_fetch_array($Resultado)){//Mientras haya un renglón, seguimos guardando los datos en $Resultado

		$Tipo_Evento = array();
		$Tipo_Evento["id"] = $Renglon["idEvento"];
		$Tipo_Evento["titulo"] = $Renglon["titulo"];
		$Tipo_Evento["fechaInicio"] = $Renglon["inicio"];
		$Tipo_Evento["fechaFinal"] = $Renglon["final"];
		array_push($Respuesta["eventos"], $Tipo_Evento);//Guardamos el dato de la BD en la posicion "tipos_eventos"
	}
	$Respuesta["estado"] = 1;
	$Respuesta["mensaje"] = "Consulta exitosa";

	echo json_encode($Respuesta);//Mandamos los datos obtenidos
	//echo $aux;
}

function ActionDeletePHP($conexion){

	$idEliminar = $_POST["idEliminar"];
	$query = "DELETE FROM eventos WHERE idEvento=".$idEliminar;
	$resultado = mysqli_query($conexion,$query);
	$Respuesta = array();

	  if(mysqli_affected_rows($conexion)>0){
		 $Respuesta['estatus'] = 1;
	  }else{
		 $Respuesta['estatus'] = 0;
	  }
	//Eliminando las imagenes  
	$query = "SELECT * FROM evidencias where id=".$idEliminar;
	$resultado = mysqli_query($conexion,$query);

	if(mysqli_affected_rows($conexion)>0){

    	 $Renglon = mysqli_fetch_array($resultado);
    	 if($Renglon['evidencia1'] != ""){
    	 	$imagen1 = $Renglon['evidencia1'];
    	 	unlink("../img/".$imagen1);
    	 }
    	 if($Renglon['evidencia2'] != ""){
    	 	$imagen2 = $Renglon['evidencia2'];
    	 	unlink("../img/".$imagen2);
    	 }

         $query = "DELETE FROM evidencias WHERE id=".$idEliminar;
     
         $resultado = mysqli_query($conexion,$query);
	}

	echo json_encode($Respuesta);
}

function ActionUpdatePHP($conexion){

	$nombreEvento = $_POST["nombreUp"];
	$descripcion = $_POST["descripcionUp"];
	$fechaInicio = $_POST["fechaInicioUp"];
	$fechaFin = $_POST["fechaFinUp"];
	$tipoEvento = $_POST["tipoEventoUp"];
	$tipoPublico = $_POST["tipoPublicoUp"];
	$categoria = $_POST['categoriaUp'];
	$idEdit = $_POST["idEdit"];

	$Respuesta['estado'] = 1;
	$Respuesta['mensaje'] = "Datos correctos";

	$query = "UPDATE eventos SET titulo='".$nombreEvento."', descripcion='".$descripcion."',inicio = '".$fechaInicio."', final = '".$fechaFin."', tipoEv = '".$tipoEvento."', categoria = '".$categoria."', publico = '".$tipoPublico."'WHERE idEvento=".$idEdit;       
	$res = mysqli_query($conexion,$query);

	if(mysqli_affected_rows($conexion)>0){
		$Respuesta['estado'] = 1;
		$Respuesta['mensaje'] = "Datos actualizados correctamente";
	}else{
		$Respuesta['estado'] = 0;
		$Respuesta['mensaje'] = "No se hicieron modificaciones";
	}
	echo json_encode($Respuesta);

}

function ActionCreatePHP($conexion){

	$Query = "SELECT * FROM eventos";//Query a realizar
	$ultimoId = 0;
	$Resultado 	= mysqli_query($conexion,$Query);//Guardamos el query obtenido

	while($Renglon = mysqli_fetch_array($Resultado)){//Mientras haya un renglón, seguimos ciclando
		$ultimoId = $Renglon['idEvento'];
	}
	$ultimoId = $ultimoId + 1; //Asi lo insertaremos al ultimo en la tabla
	//Ahora si, con el valor del ultimo ID, insertaremos el nuevo evento
	$eventoCrear = $_POST["nombre"];
	$descripcionCrear = $_POST["descripcion"];
	$fechaInicio = $_POST["fechaInicio"];
	$fechaFin = $_POST["fechaFin"];
	$tipoEvento = $_POST["tipoEvento"];
	$publico = $_POST["publico"];
	$creador = $_POST['creator'];

	$query = "INSERT INTO eventos (`idEvento`,`usuarioCreador`, `titulo`, `descripcion`,`inicio`, `final`, `tipoEv`,`publico`) VALUES ($ultimoId,'$creador','$eventoCrear','$descripcionCrear','$fechaInicio','$fechaFin','$tipoEvento','$publico')";
	$respuesta = mysqli_query($conexion,$query);
	$Respuesta = array();
	if(mysqli_affected_rows($conexion)>0){
		$Respuesta['estatus'] = 1;
		$Respuesta['ultimoId'] = $ultimoId;
	}else{
		$Respuesta['estatus'] = 0;
		$Respuesta['mensaje'] = "Error al agregarEvento";
	}
	echo json_encode($Respuesta);

}

function ActionObtenerDescripcion($conexion,$id){
	$Query = "SELECT * FROM eventos WHERE idEvento =".$id;//Query a realizar

	$Resultado 	= mysqli_query($conexion,$Query);//Guardamos el query obtenido
	$Renglon = mysqli_fetch_array($Resultado);
	$Respuesta = array();
	$Respuesta["estado"] = 1;
	$Respuesta["mensaje"] = "Consulta exitosa";
	$Respuesta["fechaInicio"] = $Renglon["inicio"];
	$Respuesta["fechaFin"] = $Renglon["final"];
	$Respuesta["publico"] = $Renglon["publico"];
	$Respuesta["tipoEvento"] = $Renglon["tipoEv"];
	$Respuesta["descripcion"] = $Renglon["descripcion"];
	$Respuesta['categoria'] = $Renglon['categoria'];

	echo json_encode($Respuesta);//Mandamos los datos obtenidos
}
?>