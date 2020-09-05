<?php

$Respuesta = array();

if(isset($_POST['action'])){

    include 'conexion.php';

    switch($_POST['action']){

        case 'read':
            ActionReadPHP($conexion);
            break;
        case 'actualizarCapturado':
            ActionActualizarPHP($conexion);
            break;
        case 'filtrarTabla':
            ActionFiltrarTabla($conexion);
    }
}else{
	$Respuesta["estado"]=0;
	$Respuesta["mensaje"]="Faltan Parametros";
	echo json_encode($Respuesta);
}

function ActionReadPHP($conexion){

    //----------------------------------Obteniendo datos de la tabla eventos--------------------------------------------
        $Query = "SELECT * FROM eventos";//Query a realizar
        
        $Respuesta["evento"] = array();//Arreglo donde guardaremos los datos de la BD

        $Resultado 	= mysqli_query($conexion,$Query);//Guardamos el query obtenido

        while($Renglon = mysqli_fetch_array($Resultado)){//Mientras haya un renglón, seguimos guardando los datos en $Resultado

            $Eventos = array();

            $Eventos["id"] 		          = $Renglon["idEvento"];
            $Eventos["usuarioCreador"]	  = $Renglon["usuarioCreador"];
            $Eventos["nombre"]            = $Renglon["titulo"];
            $Eventos["numRegistro"]       = $Renglon["NoRegistro"];
            $Eventos["rama"]              = $Renglon["Rama"];
            $Eventos["modalidad"]         = $Renglon["modalidad"];
            $Eventos["inicio"]            = $Renglon["inicio"];
            $Eventos["fin"]               = $Renglon["final"];
                //Aqui hago un query a la tabla de tipo de evento
                $idTipoEvento             = $Renglon["tipoEv"];
                $Query = "SELECT * FROM tipo_evento WHERE ID=".$idTipoEvento;
                $ResultadoQueryTipoEvento = mysqli_query($conexion,$Query);
                $RenglonDatoTipoEvento    = mysqli_fetch_array($ResultadoQueryTipoEvento);
                //Aqui hago un query a la tabla dde tipo evento
            $Eventos["tipo"]              = $RenglonDatoTipoEvento["Nombre"];
            $Eventos["instanciaAtendida"] = $Renglon["publico"];
            $Eventos["capacitador"]       = $Renglon["origenPonentes"];
            $Eventos["formaPago"]         = $Renglon["FormaDePago"];
            $Eventos["duracion"]          = $Renglon["cantidadHoras"];
            $Eventos["datoCapturado"]     = $Renglon["datosCapturados"];

            array_push($Respuesta["evento"], $Eventos);//Guardamos el dato de la BD en la posicion "evento"
        }
    //----------------------------------Obteniendo datos de la tabla eventos--------------------------------------------

    //----------------------------------Obteniendo datos de la tabla evidencias--------------------------------------------
        $Query = "SELECT * FROM evidencias";//Query a realizar

        $Resultado 	= mysqli_query($conexion,$Query);//Guardamos el query obtenido
        $contador = 0;
        while($Renglon = mysqli_fetch_array($Resultado)){//Mientras haya un renglón, seguimos guardando los datos en $Resultado

            $Evidencias = array();
            $Evidencias["cantidadMujeres"]  = $Renglon["numMujeres"];
            $Evidencias['cantidadHombres']	= $Renglon['numHombres'];

            array_push($Respuesta["evento"][$contador], $Evidencias);//Guardamos el dato de la BD en la posicion "categorias"
            $contador = $contador + 1;
        }
        
    //----------------------------------Obteniendo datos de la tabla evidencias--------------------------------------------
    $Respuesta["estado"] = 1;
	$Respuesta["mensaje"] = "Consulta exitosa";

	echo json_encode($Respuesta);//Mandamos los datos obtenidos

}

function ActionActualizarPHP($conexion){

    $Respuesta = array();
	$estado = $_POST['estado'];
	$id = $_POST['id'];
	$query = "UPDATE eventos SET datosCapturados='".$estado."'
              WHERE idEvento =".$id;
              
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
function ActionFiltrarTabla($conexion){
    $añoBuscar = $_POST["añoBuscar"];
    $trimBuscar = $_POST["trimBuscar"];
    $mesInicial = "";
    $mesFinal = "";

        if($trimBuscar == "Ene-Mar"){
            $mesInicial = "01";
            $mesFinal = "03";
        }else if($trimBuscar == "Abr-Jun"){
            $mesInicial = "04";
            $mesFinal = "06";
        }else if($trimBuscar == "Jul-Sep"){
            $mesInicial = "07";
            $mesFinal = "09";
        }else{
            $mesInicial = "10";
            $mesFinal = "12";
        }

        if($añoBuscar == "Todos" && $trimBuscar != "Todos"){
            
            $años = array();
            $años = $_POST['añosTotales'];
            $contador = 0;
            $Respuesta = array();
            $Respuesta['evento'] = array();
            $idArreglo = array();
            $contadorDeEventos = 0;                     
            $contadorIngresarHomMuj = 0;

            foreach($años as $todoslosAños){//Ciclo para ir buscando por cada año

                $añoInicial = $todoslosAños."/".$mesInicial."/01";
                $añoFinal = $todoslosAños."/".$mesFinal."/31";

                $Query = "SELECT * FROM `eventos` WHERE inicio BETWEEN '$añoInicial' and '$añoFinal' or final BETWEEN '$añoInicial' and '$añoFinal'";
                $Resultado = mysqli_query($conexion,$Query);

                if(mysqli_affected_rows($conexion) > 0){

                    while($Renglon = mysqli_fetch_array($Resultado)){
                        $Eventos = array();

                        $Eventos["id"] 		          = $Renglon["idEvento"];
                            array_push($idArreglo,$Renglon["idEvento"]);
                        $Eventos["usuarioCreador"]	  = $Renglon["usuarioCreador"];
                        $Eventos["nombre"]            = $Renglon["titulo"];
                        $Eventos["numRegistro"]       = $Renglon["NoRegistro"];
                        $Eventos["rama"]              = $Renglon["Rama"];
                        $Eventos["modalidad"]         = $Renglon["modalidad"];
                        $Eventos["inicio"]            = $Renglon["inicio"];
                        $Eventos["fin"]               = $Renglon["final"];
                            //Aqui hago un query a la tabla de tipo de evento
                            $idTipoEvento             = $Renglon["tipoEv"];
                            $Query = "SELECT * FROM tipo_evento WHERE ID=".$idTipoEvento;
                            $ResultadoQueryTipoEvento = mysqli_query($conexion,$Query);
                            $RenglonDatoTipoEvento    = mysqli_fetch_array($ResultadoQueryTipoEvento);
                            //Aqui hago un query a la tabla dde tipo evento
                        $Eventos["tipo"]              = $RenglonDatoTipoEvento["Nombre"];
                        $Eventos["instanciaAtendida"] = $Renglon["publico"];
                        $Eventos["capacitador"]       = $Renglon["origenPonentes"];
                        $Eventos["formaPago"]         = $Renglon["FormaDePago"];
                        $Eventos["duracion"]          = $Renglon["cantidadHoras"];
                        $Eventos["datoCapturado"]     = $Renglon["datosCapturados"];

                        array_push($Respuesta["evento"], $Eventos);//Guardamos el dato de la BD en la posicion "evento"
                        $contadorDeEventos = $contadorDeEventos + 1;
                    }
                }
            }

            foreach($idArreglo as $id){
                $Query = "SELECT * FROM evidencias WHERE id=".$id;//Query a realizar

                $Resultado 	= mysqli_query($conexion,$Query);//Guardamos el query obtenido
                if(mysqli_affected_rows($conexion) > 0){
                    while($Renglon = mysqli_fetch_array($Resultado)){//Mientras haya un renglón, seguimos guardando los datos en $Resultado

                        $Evidencias = array();
                        $Evidencias["cantidadMujeres"]  = $Renglon["numMujeres"];
                        $Evidencias['cantidadHombres']	= $Renglon['numHombres'];

                        array_push($Respuesta["evento"][$contador], $Evidencias);//Guardamos el dato de la BD en la posicion "categorias"
                        $contador = $contador + 1;
                    }
                }else{//En caso de no tener evidencias
                        $Evidencias = array();
                        $Evidencias["cantidadMujeres"]  = "S/E";
                        $Evidencias['cantidadHombres']	= "S/E";
                        array_push($Respuesta["evento"][$contadorIngresarHomMuj], $Evidencias);//Guardamos el dato de la BD en la posicion "categorias"
                        $contadorIngresarHomMuj = $contadorIngresarHomMuj + 1;
                }
            }
            $Respuesta['estatus'] = 1;
        }else if($añoBuscar != "Todos" && $trimBuscar != "Todos"){
                $añoInicial = $añoBuscar."/".$mesInicial."/01";
                $añoFinal = $añoBuscar."/".$mesFinal."/31";

                $Query = "SELECT * FROM `eventos` WHERE inicio BETWEEN '$añoInicial' and '$añoFinal' or final BETWEEN '$añoInicial' and '$añoFinal'";
                $Resultado = mysqli_query($conexion,$Query);
                $Respuesta = array();
                $Respuesta['evento'] = array();
                $idArreglo = array();
                $contadorDeEventos = 0;
                $contadorIngresarHomMuj = 0;


                if(mysqli_affected_rows($conexion) > 0){

                    while($Renglon = mysqli_fetch_array($Resultado)){
                        $Eventos = array();

                        $Eventos["id"] 		          = $Renglon["idEvento"];
                            array_push($idArreglo,$Renglon["idEvento"]);
                        $Eventos["usuarioCreador"]	  = $Renglon["usuarioCreador"];
                        $Eventos["nombre"]            = $Renglon["titulo"];
                        $Eventos["numRegistro"]       = $Renglon["NoRegistro"];
                        $Eventos["rama"]              = $Renglon["Rama"];
                        $Eventos["modalidad"]         = $Renglon["modalidad"];
                        $Eventos["inicio"]            = $Renglon["inicio"];
                        $Eventos["fin"]               = $Renglon["final"];
                            //Aqui hago un query a la tabla de tipo de evento
                            $idTipoEvento             = $Renglon["tipoEv"];
                            $Query = "SELECT * FROM tipo_evento WHERE ID=".$idTipoEvento;
                            $ResultadoQueryTipoEvento = mysqli_query($conexion,$Query);
                            $RenglonDatoTipoEvento    = mysqli_fetch_array($ResultadoQueryTipoEvento);
                            //Aqui hago un query a la tabla dde tipo evento
                        $Eventos["tipo"]              = $RenglonDatoTipoEvento["Nombre"];
                        $Eventos["instanciaAtendida"] = $Renglon["publico"];
                        $Eventos["capacitador"]       = $Renglon["origenPonentes"];
                        $Eventos["formaPago"]         = $Renglon["FormaDePago"];
                        $Eventos["duracion"]          = $Renglon["cantidadHoras"];
                        $Eventos["datoCapturado"]     = $Renglon["datosCapturados"];

                        array_push($Respuesta["evento"], $Eventos);//Guardamos el dato de la BD en la posicion "evento"
                        $contadorDeEventos = $contadorDeEventos + 1;
                    }

                    foreach($idArreglo as $id){
                        $Query = "SELECT * FROM evidencias WHERE id=".$id;//Query a realizar

                        $Resultado 	= mysqli_query($conexion,$Query);//Guardamos el query obtenido
                        if(mysqli_affected_rows($conexion) > 0){
                            while($Renglon = mysqli_fetch_array($Resultado)){//Mientras haya un renglón, seguimos guardando los datos en $Resultado

                                $Evidencias = array();
                                $Evidencias["cantidadMujeres"]  = $Renglon["numMujeres"];
                                $Evidencias['cantidadHombres']	= $Renglon['numHombres'];

                                array_push($Respuesta["evento"][$contadorIngresarHomMuj], $Evidencias);//Guardamos el dato de la BD en la posicion "categorias"
                                $contadorIngresarHomMuj = $contadorIngresarHomMuj + 1;
                            }
                        }else{//En caso de no tener evidencias
                    
                                $Evidencias = array();
                                $Evidencias["cantidadMujeres"]  = "S/E";
                                $Evidencias['cantidadHombres']	= "S/E";

                                array_push($Respuesta["evento"][$contadorIngresarHomMuj], $Evidencias);//Guardamos el dato de la BD en la posicion "categorias"
                                $contadorIngresarHomMuj = $contadorIngresarHomMuj + 1;
                        }
                    }
                    $Respuesta['estatus'] = 1;
                }else{
                    $Respuesta['estatus'] = 0;
                }
        }else if($añoBuscar != "Todos" && $trimBuscar == "Todos"){

            $añoInicial = $añoBuscar."/01/01";
            $añoFinal = $añoBuscar."/12/31";

            $Query = "SELECT * FROM `eventos` WHERE inicio BETWEEN '$añoInicial' and '$añoFinal' or final BETWEEN '$añoInicial' and '$añoFinal'";
            $Resultado = mysqli_query($conexion,$Query);
            $Respuesta = array();
            $Respuesta['evento'] = array();
            $idArreglo = array();
            $contadorDeEventos = 0;                    
            $contadorIngresarHomMuj = 0;

            if(mysqli_affected_rows($conexion) > 0){

                while($Renglon = mysqli_fetch_array($Resultado)){
                    $Eventos = array();

                    $Eventos["id"] 		          = $Renglon["idEvento"];
                        array_push($idArreglo,$Renglon["idEvento"]);
                    $Eventos["usuarioCreador"]	  = $Renglon["usuarioCreador"];
                    $Eventos["nombre"]            = $Renglon["titulo"];
                    $Eventos["numRegistro"]       = $Renglon["NoRegistro"];
                    $Eventos["rama"]              = $Renglon["Rama"];
                    $Eventos["modalidad"]         = $Renglon["modalidad"];
                    $Eventos["inicio"]            = $Renglon["inicio"];
                    $Eventos["fin"]               = $Renglon["final"];
                        //Aqui hago un query a la tabla de tipo de evento
                        $idTipoEvento             = $Renglon["tipoEv"];
                        $Query = "SELECT * FROM tipo_evento WHERE ID=".$idTipoEvento;
                        $ResultadoQueryTipoEvento = mysqli_query($conexion,$Query);
                        $RenglonDatoTipoEvento    = mysqli_fetch_array($ResultadoQueryTipoEvento);
                        //Aqui hago un query a la tabla dde tipo evento
                    $Eventos["tipo"]              = $RenglonDatoTipoEvento["Nombre"];
                    $Eventos["instanciaAtendida"] = $Renglon["publico"];
                    $Eventos["capacitador"]       = $Renglon["origenPonentes"];
                    $Eventos["formaPago"]         = $Renglon["FormaDePago"];
                    $Eventos["duracion"]          = $Renglon["cantidadHoras"];
                    $Eventos["datoCapturado"]     = $Renglon["datosCapturados"];

                    array_push($Respuesta["evento"], $Eventos);//Guardamos el dato de la BD en la posicion "evento"
                    $contadorDeEventos = $contadorDeEventos + 1;
                }

                foreach($idArreglo as $id){
                    $Query = "SELECT * FROM evidencias WHERE id=".$id;//Query a realizar

                    $Resultado 	= mysqli_query($conexion,$Query);//Guardamos el query obtenido
                    if(mysqli_affected_rows($conexion) > 0){
                        while($Renglon = mysqli_fetch_array($Resultado)){//Mientras haya un renglón, seguimos guardando los datos en $Resultado

                            $Evidencias = array();
                            $Evidencias["cantidadMujeres"]  = $Renglon["numMujeres"];
                            $Evidencias['cantidadHombres']	= $Renglon['numHombres'];

                            array_push($Respuesta["evento"][$contadorIngresarHomMuj], $Evidencias);//Guardamos el dato de la BD en la posicion "categorias"
                            $contadorIngresarHomMuj = $contadorIngresarHomMuj + 1;
                        }
                    }else{//En caso de no tener evidencias
                
                            $Evidencias = array();
                            $Evidencias["cantidadMujeres"]  = "S/E";
                            $Evidencias['cantidadHombres']	= "S/E";

                            array_push($Respuesta["evento"][$contadorIngresarHomMuj], $Evidencias);//Guardamos el dato de la BD en la posicion "categorias"
                            $contadorIngresarHomMuj = $contadorIngresarHomMuj + 1;
                    }
                }
                $Respuesta['estatus'] = 1;
            }else{
                $Respuesta['estatus'] = 0;
            }
        }else{

            $años = array();
            $años = $_POST['añosTotales'];
            $Respuesta = array();
            $Respuesta['evento'] = array();
            $idArreglo = array();
            $contadorDeEventos = 0;                     
            $contadorIngresarHomMuj = 0;

            foreach($años as $todoslosAños){//Ciclo para ir buscando por cada año

                $añoInicial = $todoslosAños."/01/01";
                $añoFinal = $todoslosAños."/12/31";

                $Query = "SELECT * FROM `eventos` WHERE inicio BETWEEN '$añoInicial' and '$añoFinal' or final BETWEEN '$añoInicial' and '$añoFinal'";
                $Resultado = mysqli_query($conexion,$Query);

                if(mysqli_affected_rows($conexion) > 0){

                    while($Renglon = mysqli_fetch_array($Resultado)){
                        $Eventos = array();

                        $Eventos["id"] 		          = $Renglon["idEvento"];
                            array_push($idArreglo,$Renglon["idEvento"]);
                        $Eventos["usuarioCreador"]	  = $Renglon["usuarioCreador"];
                        $Eventos["nombre"]            = $Renglon["titulo"];
                        $Eventos["numRegistro"]       = $Renglon["NoRegistro"];
                        $Eventos["rama"]              = $Renglon["Rama"];
                        $Eventos["modalidad"]         = $Renglon["modalidad"];
                        $Eventos["inicio"]            = $Renglon["inicio"];
                        $Eventos["fin"]               = $Renglon["final"];
                            //Aqui hago un query a la tabla de tipo de evento
                            $idTipoEvento             = $Renglon["tipoEv"];
                            $Query = "SELECT * FROM tipo_evento WHERE ID=".$idTipoEvento;
                            $ResultadoQueryTipoEvento = mysqli_query($conexion,$Query);
                            $RenglonDatoTipoEvento    = mysqli_fetch_array($ResultadoQueryTipoEvento);
                            //Aqui hago un query a la tabla dde tipo evento
                        $Eventos["tipo"]              = $RenglonDatoTipoEvento["Nombre"];
                        $Eventos["instanciaAtendida"] = $Renglon["publico"];
                        $Eventos["capacitador"]       = $Renglon["origenPonentes"];
                        $Eventos["formaPago"]         = $Renglon["FormaDePago"];
                        $Eventos["duracion"]          = $Renglon["cantidadHoras"];
                        $Eventos["datoCapturado"]     = $Renglon["datosCapturados"];

                        array_push($Respuesta["evento"], $Eventos);//Guardamos el dato de la BD en la posicion "evento"
                        $contadorDeEventos = $contadorDeEventos + 1;
                    }
                }
            }

            foreach($idArreglo as $id){
                $Query = "SELECT * FROM evidencias WHERE id=".$id;//Query a realizar

                $Resultado 	= mysqli_query($conexion,$Query);//Guardamos el query obtenido
                if(mysqli_affected_rows($conexion) > 0){
                    while($Renglon = mysqli_fetch_array($Resultado)){//Mientras haya un renglón, seguimos guardando los datos en $Resultado

                        $Evidencias = array();
                        $Evidencias["cantidadMujeres"]  = $Renglon["numMujeres"];
                        $Evidencias['cantidadHombres']	= $Renglon['numHombres'];

                        array_push($Respuesta["evento"][$contadorIngresarHomMuj], $Evidencias);//Guardamos el dato de la BD en la posicion "categorias"
                        $contadorIngresarHomMuj = $contadorIngresarHomMuj + 1;
                    }
                }else{//En caso de no tener evidencias
                        $Evidencias = array();
                        $Evidencias["cantidadMujeres"]  = "S/E";
                        $Evidencias['cantidadHombres']	= "S/E";
                        array_push($Respuesta["evento"][$contadorIngresarHomMuj], $Evidencias);//Guardamos el dato de la BD en la posicion "categorias"
                        $contadorIngresarHomMuj = $contadorIngresarHomMuj + 1;
                }
            }
            $Respuesta['estatus'] = 1;      
           
        }
    echo json_encode($Respuesta);
}
?>