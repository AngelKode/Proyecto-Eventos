<?php

include 'conexion.php';

if(isset($_POST['action'])){

    switch($_POST['action']){

        case 'read':{
            actionReadRecordatorio($conexion);
            break;
        }
        case 'create':{
            actionCreateRecordatorio($conexion);
            break;
        }

        case 'cambiarEstructuraMensaje':{
            actionCambiarEstructuraMensaje($conexion);
            break;
        }

        case 'obtenerDatosEstructuraMensaje':{
            actionObtenerEstructuraMensaje($conexion);
            break;
        }

        case 'obtenerHorario':{
            actionObtenerHorario($conexion);
            break;
        }

        case 'cambiarHorario':{
            actionCambiarHora($conexion);
            break;
        }

        case 'obtenerFrecuencia':{
            actionObtenerFrecuencia($conexion);
            break;
        }

        case 'delete':{
            actionDeleteRecordatorio($conexion);
            break;
        }

        case 'cambiarFrecuencia':{
            actionCambiarFrecuencia($conexion);
            break;
        }
    }
}else{

}

function actionReadRecordatorio($conexion){
    
    $Query = "SELECT * FROM recordatorio";
    $Resultado = mysqli_query($conexion,$Query);
    $Respuesta = array();

    if(mysqli_affected_rows($conexion) > 0 ){
        $Respuesta['estatus'] = 1;
        $Renglon = mysqli_fetch_array($Resultado);
        $Respuesta['mensaje'] = $Renglon['mensaje'];
        $Respuesta['frecuencia'] = $Renglon['frecuencia'];
        $Respuesta['horario'] = $Renglon['horario'];
        //Obtenemos valores de la fecha
        $fechaInicio = $Renglon['fechaInicio'];
        $Respuesta['anio'] = substr($fechaInicio,0,4);
        $Respuesta['mes'] = substr($fechaInicio,5,2);
        $Respuesta['dia'] = substr($fechaInicio,8,2);
    }else{
        $Respuesta['estatus'] = 0;
    }

    echo json_encode($Respuesta);
}

function actionCreateRecordatorio($conexion){
    $mensaje = $_POST['mensaje'];
    $frecuencia = $_POST['frecuencia'];
    $horario = $_POST['horario'];
    $fechaActual = $_POST['fechaInicio'];
    $smtp = $_POST['smtp'];
    $remitente = $_POST['remitente'];
    $contra = $_POST['passwd'];
    $nombre = $_POST['nombre']; 


    $Query = "INSERT INTO recordatorio (`mensaje`,`frecuencia`,`horario`,`fechaInicio`,`smtp`,`remitente`,`passwd`,`nombreRemitente`)  VALUES ('$mensaje',$frecuencia,'$horario','$fechaActual','$smtp','$remitente','$contra','$nombre')";
    $Respuesta = mysqli_query($conexion,$Query);
    $Resultado = array();

    if(mysqli_affected_rows($conexion) > 0){
        $Resultado['estatus'] = 1;
    }else{
        $Resultado['estatus'] = 0;
    }

    echo json_encode($Resultado);
}

function actionCambiarEstructuraMensaje($conexion){

    $mensaje = $_POST['mensaje'];
    $remitente = $_POST['remitente'];
    $nombre = $_POST['nombreRem'];
    $contra = $_POST['contra'];
    $smtp = $_POST['smtp'];
    //Actualizamos la BD
    $Query = "UPDATE recordatorio SET mensaje = '$mensaje', remitente = '$remitente', nombreRemitente = '$nombre', passwd = '$contra', smtp = '$smtp'";
    $Resultado = mysqli_query($conexion, $Query);
    $Respuesta = array();

        if(mysqli_affected_rows($conexion) > 0){
            $Respuesta['estatus'] = 1;
        }else{
            $Respuesta['estatus'] = 0;
        }
    echo json_encode($Respuesta);
}

function actionObtenerEstructuraMensaje($conexion){

    $Query = "SELECT * FROM recordatorio";
    $Resultado = mysqli_query($conexion,$Query);
    $Respuesta = array();

        if(mysqli_affected_rows($conexion) > 0){
            $Respuesta['estatus'] = 1;
            $Renglon = mysqli_fetch_array($Resultado);
            $Respuesta['mensaje'] = $Renglon['mensaje'];
            $Respuesta['smtp'] = $Renglon['smtp'];
            $Respuesta['remitente'] = $Renglon['remitente'];
            $Respuesta['passwd'] = $Renglon['passwd'];
            $Respuesta['nombreRemitente'] = $Renglon['nombreRemitente'];
        }else{
            $Respuesta['estatus'] = 0;
        }
    echo json_encode($Respuesta);
}   

function actionObtenerHorario($conexion){

    $Query = "SELECT * FROM recordatorio";
    $Resultado = mysqli_query($conexion,$Query);
    $Respuesta = array();

        if(mysqli_affected_rows($conexion) > 0){
            $Respuesta['estatus'] = 1;
            $Renglon = mysqli_fetch_array($Resultado);
            $Hora =  $Renglon['horario'];
            $Hora = substr($Hora,0,5);
            $Respuesta['hora'] = $Hora;
        }else{
            $Respuesta['estatus'] = 0;
        }
    echo json_encode($Respuesta);
}

function actionCambiarHora($conexion){

    $nuevaHora = $_POST['hora'];
    $Query = "UPDATE recordatorio SET horario = '$nuevaHora'";
    $Resultado = mysqli_query($conexion,$Query);
    $Respuesta = array();

    if(mysqli_affected_rows($conexion) > 0){
        $Respuesta['estatus'] = 1;
    }else{
        $Respuesta['estatus'] = 0;
    }
    echo json_encode($Respuesta);
}

function actionObtenerFrecuencia($conexion){
   
    $Query = "SELECT * FROM recordatorio";
    $Resultado = mysqli_query($conexion,$Query);
    $Respuesta = array();

    if(mysqli_affected_rows($conexion) > 0){
        $Respuesta['estatus'] = 1;
        $Renglon = mysqli_fetch_array($Resultado);
        $Respuesta['frecuencia'] = $Renglon['frecuencia'];
    }else{
        $Respuesta['estatus'] = 0;
    }
    echo json_encode($Respuesta); 
}

function actionDeleteRecordatorio($conexion){

    $Query = "DELETE FROM recordatorio";
    $Resultado = mysqli_query($conexion,$Query);
    $Respuesta = array();

    if(mysqli_affected_rows($conexion) >  0){
        $Respuesta['estatus'] = 1;
    }else{
        $Respuesta['estatus'] = 0;
    }

    echo json_encode($Respuesta);
}

function actionCambiarFrecuencia($conexion){

    $frecuencia = $_POST['frecuencia'];
    $fecha = $_POST['fechaNueva'];

    $Query = "UPDATE recordatorio SET frecuencia = $frecuencia, fechaInicio = '$fecha'";
    $Resultado = mysqli_query($conexion,$Query);
    $Respuesta = array();

    if(mysqli_affected_rows($conexion) > 0){
        $Respuesta['estatus'] = 1;
    }else{
        $Respuesta['estatus'] = 0;
    }
    echo json_encode($Respuesta);
}
?>