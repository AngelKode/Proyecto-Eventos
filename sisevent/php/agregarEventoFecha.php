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
		case 'descripcionEliminar':
			$idElim = $_POST['id'];
			ActionObtenerDescripcionYTablas($conexion,$idElim);
			break;
		case 'obtenerCostoHoras':
			ActionObtenerHorasCosto($conexion);
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
	$creadorNom = $_POST['creadorNombre'];	
	$creadorId = $_POST['creadorId'];

	   if($creadorNom != "Admin"){//Si no es el administrador, checamos cuales eventos ha dado de alta
		 $Query = "SELECT * FROM eventos WHERE usuarioCreador =".$creadorId;//Query a realizar
	   }else{
		 $Query = "SELECT * FROM eventos";//Query a realizar
	   }

	$Respuesta = array();
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
	$registroEdit = $_POST['registroEdit']; 
	$ramaEdit = $_POST['ramaEdit'];
	$modalidad = $_POST['modalidadUpdt'];  
	$fechaInicio = $_POST["fechaInicioUp"];
	$fechaFin = $_POST["fechaFinUp"];
	$tipoEvento = $_POST["tipoEventoUp"];
	$tipoPublico = $_POST["tipoPublicoUp"];
	$categoria = $_POST['categoriaUp'];
	$costoEditar = $_POST['costoEdit'];
	$fomaPagoEditar = $_POST['formaPagoEdit'];
	$horasEditar = $_POST['horasEdit'];
	$origPonentesEditar = $_POST['origPonentesEditar'];
	$memInstEditar = $_POST['boolMemInstEdit'];
	$idEdit = $_POST["idEdit"];

	$Respuesta['estado'] = 1;
	$Respuesta['mensaje'] = "Datos correctos";

	$query = "UPDATE eventos SET titulo='".$nombreEvento."', descripcion='".$descripcion."', NoRegistro = '".$registroEdit."',Rama = '".$ramaEdit."',modalidad = '".$modalidad."',inicio = '".$fechaInicio."', final = '".$fechaFin."', tipoEv = '".$tipoEvento."', categoria = '".$categoria."', publico = '".$tipoPublico."', origenPonentes = '".$origPonentesEditar."', costoEvento = '".$costoEditar."',FormaDePago = '".$fomaPagoEditar."',cantidadHoras = '".$horasEditar."', MemoriaInstitucional = '".$memInstEditar."' WHERE idEvento=".$idEdit;       
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
	$noRegistro = $_POST['numeroRegistro'];
	$rama = $_POST['ramaEvento'];
	$modalidad = $_POST['modalidadEvento'];
	$fechaInicio = $_POST["fechaInicio"];
	$fechaFin = $_POST["fechaFin"];
	$tipoEvento = $_POST["tipoEvento"];
	$publico = $_POST["publico"];
	$categoria = $_POST['categ'];
	$costo = $_POST['costoEv'];
	$formaPago = $_POST['formaDePago'];
	$horasEvento = $_POST['tiempoHora'];
	$origenDePonentes = $_POST['origPonentes'];
	$boolMemoriaInstitucional = $_POST['memoriaInstitucional'];
	$creador = $_POST['idCreador'];

	$query = "INSERT INTO eventos (`idEvento`,`usuarioCreador`, `titulo`, `descripcion`,`NoRegistro`,`Rama`,`modalidad`,
									`inicio`, `final`,`tipoEv`,`categoria`,`publico`,`origenPonentes`,`costoEvento`, 
									`FormaDePago`,`cantidadHoras`,`MemoriaInstitucional`) 
			  VALUES ($ultimoId,$creador,'$eventoCrear','$descripcionCrear','$noRegistro','$rama','$modalidad',
			  		 '$fechaInicio','$fechaFin','$tipoEvento','$categoria','$publico','$origenDePonentes','$costo',
					 '$formaPago','$horasEvento','$boolMemoriaInstitucional')";
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
	$Respuesta['registro'] = $Renglon['NoRegistro'];
	$Respuesta['rama'] = $Renglon['Rama'];
	$Respuesta['modalidad'] = $Renglon['modalidad'];
	$Respuesta['categoria'] = $Renglon['categoria'];
	$Respuesta['costo'] = $Renglon['costoEvento'];
	$Respuesta['formaPago'] = $Renglon['FormaDePago'];
	$Respuesta['origenPonentes'] = $Renglon['origenPonentes'];
	$Respuesta['cantidadHoras'] = $Renglon['cantidadHoras'];
	$Respuesta['memInst'] = $Renglon['MemoriaInstitucional'];

	echo json_encode($Respuesta);//Mandamos los datos obtenidos
}

function ActionObtenerHorasCosto($conexion){

	$id = $_POST['id'];

	$Query = "SELECT * FROM eventos WHERE idEvento =".$id;
	$Resultado = mysqli_query($conexion,$Query);
	$Renglon = mysqli_fetch_array($Resultado);
	$Respuesta = array();
	$Respuesta['horasEvento'] = $Renglon['cantidadHoras'];
	$Respuesta['costoEvento'] = $Renglon['costoEvento'];
	
	echo json_encode($Respuesta);
}

function ActionObtenerDescripcionYTablas($conexion,$id){
	
	$Query = "SELECT * FROM eventos WHERE idEvento =".$id;//Query a realizar

	$Resultado 	= mysqli_query($conexion,$Query);//Guardamos el query obtenido
	$Renglon = mysqli_fetch_array($Resultado);
	$Respuesta = array();
	$Respuesta["estado"] = 1;
	$Respuesta["mensaje"] = "Consulta exitosa";
	$Respuesta["fechaInicio"] = $Renglon["inicio"];
	$Respuesta["fechaFin"] = $Renglon["final"];
	$Respuesta["publico"] = $Renglon["publico"];
	$Respuesta["descripcion"] = $Renglon["descripcion"];
	$Respuesta['modalidad'] = $Renglon['modalidad'];
	$Respuesta['numRegistro'] = $Renglon['NoRegistro'];
	$Respuesta['rama'] = $Renglon['Rama'];
	$Respuesta['costo'] = $Renglon['costoEvento'];
	$Respuesta['formaPago'] = $Renglon['FormaDePago'];
	$Respuesta['origenPonentes'] = $Renglon['origenPonentes'];
	$Respuesta['cantidadHoras'] = $Renglon['cantidadHoras'];
	$Respuesta['memInst'] = $Renglon['MemoriaInstitucional'];

	//Con las ID's obtenidas, buscamos en cada tabla el dato
		//Primero el tipo de evento
		$idTipoEvento = $Renglon['tipoEv'];
		$Query = "SELECT * FROM tipo_evento WHERE ID =".$idTipoEvento;
		$Resultado 	= mysqli_query($conexion,$Query);//Guardamos el query obtenido
		$RenglonTipoEv = mysqli_fetch_array($Resultado);
		$Respuesta["tipoEvento"] = $RenglonTipoEv["Nombre"];

		//Ahora la categoria
		$idCategoria = $Renglon['categoria'];
		$Query = "SELECT * FROM categoria WHERE id =".$idCategoria;
		$Resultado 	= mysqli_query($conexion,$Query);//Guardamos el query obtenido
		$RenglonCategoria = mysqli_fetch_array($Resultado);
		$Respuesta['categoria'] = $RenglonCategoria['Nombre'];
	echo json_encode($Respuesta);//Mandamos los datos obtenidos
}
?>