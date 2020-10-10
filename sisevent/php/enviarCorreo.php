<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if(isset($_POST['action']) == false){
    include 'conexion.php';//Archivo de la conexion a la bd
    //Checamos si es momento de enviar los correos o no
    $Respuesta = array();
    //Obtenemos la fecha actual
    $Query = "SELECT DATE_FORMAT(now(),'%d/%m/%Y') AS 'fecha'";
    $Resultado = mysqli_query($conexion,$Query);
    $Renglon = mysqli_fetch_array($Resultado);
    $fecha = $Renglon['fecha'];

    $anio = substr($fecha,6,4);
    $mes = substr($fecha,3,2);
    $dia = substr($fecha,0,2);
    $fechaHoy = $anio."-".$mes."-".$dia;

    //Obtenemos la hora actual
    $Query = "SELECT DATE_FORMAT(now(),'%H:%i') AS 'hora'";
    $Resultado = mysqli_query($conexion,$Query);
    $Renglon = mysqli_fetch_array($Resultado);
    $horaActual = $Renglon['hora'];

    //Obtenemos que tipo de frecuencia hay en la BD
    $Query = "SELECT * FROM recordatorio";
    $Resultado = mysqli_query($conexion,$Query);
    $Renglon = mysqli_fetch_array($Resultado);
    $tipoFrecuencia = $Renglon['frecuencia'];
    //Dependiendo el tipo, aumentamos los dias o el mes, usando un query para ser exactos
    $mensaje = $Renglon['mensaje'];
    $remitente = $Renglon['remitente'];
    $contrasenia = $Renglon['passwd'];
    $nombreRemitente = $Renglon['nombreRemitente'];
    $smtp = $Renglon['smtp'];

    switch($tipoFrecuencia){
        case '1' :{

            $Query = "SELECT DATE_ADD(recordatorio.fechaInicio,INTERVAL 1 DAY) AS 'siguienteFecha' FROM recordatorio";
            $Resultado = mysqli_query($conexion,$Query);
            $Renglon = mysqli_fetch_array($Resultado);
            $SiguienteFecha = $Renglon['siguienteFecha'];

            //Ahora obtenemos la hora, puede ser el mismo dia, pero a una hora mas tarde
            $Query = "SELECT HOUR(recordatorio.horario) AS horario FROM recordatorio;";
            $Resultado = mysqli_query($conexion,$Query);
            $Renglon = mysqli_fetch_array($Resultado);
            $horaEnviar = intval($Renglon['horario']);

            //Y obtenemos los minutos
            $Query = "SELECT MINUTE(recordatorio.horario) AS horario FROM recordatorio;";
            $Resultado = mysqli_query($conexion,$Query);
            $Renglon = mysqli_fetch_array($Resultado);
            $minutoEnviar = intval($Renglon['horario']);

            //Obtenemos la hora actual
            $horaAhorita = intval(substr($horaActual,0,2));
            $minutosAhorita = intval(substr($horaActual,3,2));

            //Obtenemos cuantos dias han pasado desde la fecha de inicio
            $Query = "SELECT TIMESTAMPDIFF(DAY, fechaInicio, '$fechaHoy') AS diasTranscurridos FROM recordatorio;";
            $Resultado = mysqli_query($conexion,$Query);
            $Renglon = mysqli_fetch_array($Resultado);
            $diasTranscurridos = intval($Renglon['diasTranscurridos']);
            $boolHora = false;

            if($horaAhorita > $horaEnviar){
                $boolHora = true;
            }else if($horaAhorita = $horaEnviar){
                if($minutosAhorita >= $minutoEnviar){
                    $boolHora = true;
                }else{
                    $boolHora = false;
                }
            }else{
                $boolHora = false;
            }
            //Ahora comparamos si la siguiente fecha es la de hoy, si si lo es, mandamos el correo
            if($diasTranscurridos == 1 && ($boolHora)){
                enviarCorreo($conexion,$mensaje,$remitente,$nombreRemitente,$contrasenia,$fechaHoy, $smtp);
            }
            break;
        }
        case '2':{
           
            $Query = "SELECT DATE_ADD(recordatorio.fechaInicio,INTERVAL 7 DAY) AS 'siguienteFecha' FROM recordatorio";
            $Resultado = mysqli_query($conexion,$Query);
            $Renglon = mysqli_fetch_array($Resultado);
            $SiguienteFecha = $Renglon['siguienteFecha'];

            //Ahora obtenemos la hora, puede ser el mismo dia, pero a una hora mas tarde
            $Query = "SELECT HOUR(recordatorio.horario) AS horario FROM recordatorio;";
            $Resultado = mysqli_query($conexion,$Query);
            $Renglon = mysqli_fetch_array($Resultado);
            $horaEnviar = intval($Renglon['horario']);

            //Y obtenemos los minutos
            $Query = "SELECT MINUTE(recordatorio.horario) AS horario FROM recordatorio;";
            $Resultado = mysqli_query($conexion,$Query);
            $Renglon = mysqli_fetch_array($Resultado);
            $minutoEnviar = intval($Renglon['horario']);

            //Obtenemos la hora actual
            $horaAhorita = intval(substr($horaActual,0,2));
            $minutosAhorita = intval(substr($horaActual,3,2));

            //Obtenemos cuantos dias han pasado desde la fecha de inicio
            $Query = "SELECT TIMESTAMPDIFF(DAY, fechaInicio, '$fechaHoy') AS diasTranscurridos FROM recordatorio;";
            $Resultado = mysqli_query($conexion,$Query);
            $Renglon = mysqli_fetch_array($Resultado);
            $diasTranscurridos = intval($Renglon['diasTranscurridos']);
            $boolHora = false;

            if($horaAhorita > $horaEnviar){
                $boolHora = true;
            }else if($horaAhorita = $horaEnviar){
                if($minutosAhorita >= $minutoEnviar){
                    $boolHora = true;
                }else{
                    $boolHora = false;
                }
            }else{
                $boolHora = false;
            }

            //Ahora comparamos si la siguiente fecha es la de hoy, si si lo es, mandamos el correo
            if($diasTranscurridos == 7 && ($boolHora)){
                 enviarCorreo($conexion,$mensaje,$remitente,$nombreRemitente,$contrasenia,$fechaHoy, $smtp);
            }
            break;
        }
        case '3':{
           
            $Query = "SELECT DATE_ADD(recordatorio.fechaInicio,INTERVAL 15 DAY) AS 'siguienteFecha' FROM recordatorio";
            $Resultado = mysqli_query($conexion,$Query);
            $Renglon = mysqli_fetch_array($Resultado);
            $SiguienteFecha = $Renglon['siguienteFecha'];

            //Ahora obtenemos la hora, puede ser el mismo dia, pero a una hora mas tarde
            $Query = "SELECT HOUR(recordatorio.horario) AS horario FROM recordatorio;";
            $Resultado = mysqli_query($conexion,$Query);
            $Renglon = mysqli_fetch_array($Resultado);
            $horaEnviar = intval($Renglon['horario']);

            //Y obtenemos los minutos
            $Query = "SELECT MINUTE(recordatorio.horario) AS horario FROM recordatorio;";
            $Resultado = mysqli_query($conexion,$Query);
            $Renglon = mysqli_fetch_array($Resultado);
            $minutoEnviar = intval($Renglon['horario']);

            //Obtenemos la hora actual
            $horaAhorita = intval(substr($horaActual,0,2));
            $minutosAhorita = intval(substr($horaActual,3,2));

            //Obtenemos cuantos dias han pasado desde la fecha de inicio
            $Query = "SELECT TIMESTAMPDIFF(DAY, fechaInicio, '$fechaHoy') AS diasTranscurridos FROM recordatorio;";
            $Resultado = mysqli_query($conexion,$Query);
            $Renglon = mysqli_fetch_array($Resultado);
            $diasTranscurridos = intval($Renglon['diasTranscurridos']);
            $boolHora = false;

            if($horaAhorita > $horaEnviar){
                $boolHora = true;
            }else if($horaAhorita = $horaEnviar){
                if($minutosAhorita >= $minutoEnviar){
                    $boolHora = true;
                }else{
                    $boolHora = false;
                }
            }else{
                $boolHora = false;
            }
            //Ahora comparamos si la siguiente fecha es la de hoy, si si lo es, mandamos el correo
            if($diasTranscurridos == 15 && ($boolHora)){
                enviarCorreo($conexion,$mensaje,$remitente,$nombreRemitente,$contrasenia,$fechaHoy, $smtp);
            }
            break;
        }
        case '4':{
            
            $Query = "SELECT DATE_ADD(recordatorio.fechaInicio,INTERVAL 1 MONTH) AS 'siguienteFecha' FROM recordatorio";
            $Resultado = mysqli_query($conexion,$Query);
            $Renglon = mysqli_fetch_array($Resultado);
            $SiguienteFecha = $Renglon['siguienteFecha'];

            //Ahora obtenemos la hora, puede ser el mismo dia, pero a una hora mas tarde
            $Query = "SELECT HOUR(recordatorio.horario) AS horario FROM recordatorio;";
            $Resultado = mysqli_query($conexion,$Query);
            $Renglon = mysqli_fetch_array($Resultado);
            $horaEnviar = intval($Renglon['horario']);

            //Y obtenemos los minutos
            $Query = "SELECT MINUTE(recordatorio.horario) AS horario FROM recordatorio;";
            $Resultado = mysqli_query($conexion,$Query);
            $Renglon = mysqli_fetch_array($Resultado);
            $minutoEnviar = intval($Renglon['horario']);

            //Obtenemos la hora actual
            $horaAhorita = intval(substr($horaActual,0,2));
            $minutosAhorita = intval(substr($horaActual,3,2));

            //Obtenemos cuantos dias han pasado desde la fecha de inicio
            $Query = "SELECT TIMESTAMPDIFF(MONTH, fechaInicio, '$fechaHoy') AS mesesTranscurridos FROM recordatorio;";
            $Resultado = mysqli_query($conexion,$Query);
            $Renglon = mysqli_fetch_array($Resultado);
            $mesesTranscurridos = intval($Renglon['mesesTranscurridos']);
            $boolHora = false;

            if($horaAhorita > $horaEnviar){
                $boolHora = true;
            }else if($horaAhorita = $horaEnviar){
                if($minutosAhorita >= $minutoEnviar){
                    $boolHora = true;
                }else{
                    $boolHora = false;
                }
            }else{
                $boolHora = false;
            }
            //Ahora comparamos si la siguiente fecha es la de hoy, si si lo es, mandamos el correo
            if($mesesTranscurridos == 1 && ($boolHora)){
                enviarCorreo($conexion,$mensaje,$remitente,$nombreRemitente,$contrasenia,$fechaHoy, $smtp);
            }
            break;
        }
    }
    echo json_encode($Respuesta);
}else{
    include 'conexion.php';//Archivo de la conexion a la bd
    //Checamos si es momento de enviar los correos o no
    //Obtenemos la fecha actual
    $Query = "SELECT DATE_FORMAT(now(),'%d/%m/%Y') AS 'fecha'";
    $Resultado = mysqli_query($conexion,$Query);
    $Renglon = mysqli_fetch_array($Resultado);
    $fecha = $Renglon['fecha'];

    $anio = substr($fecha,6,4);
    $mes = substr($fecha,3,2);
    $dia = substr($fecha,0,2);
    $fechaHoy = $anio."-".$mes."-".$dia;

    //Obtenemos que tipo de frecuencia hay en la BD
    $Query = "SELECT * FROM recordatorio";
    $Resultado = mysqli_query($conexion,$Query);
    $Renglon = mysqli_fetch_array($Resultado);
    $tipoFrecuencia = $Renglon['frecuencia'];
    //Dependiendo el tipo, aumentamos los dias o el mes, usando un query para ser exactos
    $mensaje = $Renglon['mensaje'];
    $remitente = $Renglon['remitente'];
    $contrasenia = $Renglon['passwd'];
    $nombreRemitente = $Renglon['nombreRemitente'];
    $smtp = $Renglon['smtp'];
    $Respuesta = array();
    enviarCorreo($conexion,$mensaje,$remitente,$nombreRemitente,$contrasenia,$fechaHoy, $smtp);
    echo json_encode($Respuesta);
}

function enviarCorreo($conexion,$mensaje,$remitente,$nombreRemitente,$contrasenia,$fechaActual,$smtp){

    require 'srcPHPMailer/Exception.php';
    require 'srcPHPMailer/PHPMailer.php';
    require 'srcPHPMailer/SMTP.php';

    $mail = new PHPMailer(true);

    try {
        //Server settings
        $mail->SMTPDebug = 2;                     
        $mail->isSMTP();                                            
        $mail->Host       = $smtp;                       
        $mail->SMTPAuth   = true;                                   
        $mail->Username   = $remitente;                    
        $mail->Password   = $contrasenia;                              
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;        
        $mail->Port       = 587;                                    
    
        //Recipients
        $mail->setFrom($remitente, $nombreRemitente);
        //Leemos los correos a enviar de la BD
            $Query = "SELECT * FROM usuarioeditor";
            $Resultado = mysqli_query($conexion,$Query);
        //Leemos los correos a enviar de la BD  
        
        //Agregamos los correos al objeto Mail
        while($Renglon = mysqli_fetch_array($Resultado)){
            $mail->addAddress($Renglon['Correo_Editor']);
        }   
           
        // Content
        $mail->isHTML(true);                                 
        $mail->Subject = 'Recordatorio Alta de Eventos';
        $mail->Body    = $mensaje;
    
        $mail->send();
        //Una vez enviado, actualizamos la BD con los nuevos datos
        $Query = "UPDATE recordatorio SET fechaInicio = '$fechaActual'";
        $Resultado = mysqli_query($conexion,$Query);
         echo "Bien";
    } catch (Exception $e) {
        echo "No se pudo mandar el mensaje";
    }

}
?>