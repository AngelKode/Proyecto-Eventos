<?php 

    include 'conexion.php';

    if(isset($_POST['action'])){
        
        switch($_POST['action']){

            case 'read':{
                ActionReadPHP($conexion);
                break;
            }

            case 'buscarEvento':{
                ActionBuscarEventoPHP($conexion);
                break;
            }

            case 'agregarEdicionMemoria':{
                ActionAgregarEdicionPHP($conexion);
                break;
            }

            case 'cambiarEstatusLiberar':{
                ActionCambiarEstatusLiberadoPHP($conexion);
                break;
            }
            default:{
                 break;
            }

        }


    }

function ActionReadPHP($conexion){

    $Query = "SELECT * FROM eventos";
    $Resultado = mysqli_query($conexion,$Query);
    $Respuesta = array();
    $Respuesta['eventos'] = array();

        if(mysqli_affected_rows($conexion) > 0){

            while($Renglon = mysqli_fetch_array($Resultado)){
                $Eventos = array();

                $Eventos['id'] = $Renglon['idEvento'];
                $Eventos['nombre'] = $Renglon['titulo'];
                    //QUERY USANDO EL ID DE LA CATEGORIA, A LA TABLA DE TIPOS DE EVENTOS
                        $idCategoria = $Renglon['categoria'];
                        $Query = "SELECT * FROM categoria WHERE id =".$idCategoria;
                        $Result = mysqli_query($conexion,$Query);
                        $Dato = mysqli_fetch_array($Result);
                        $Eventos['categoria'] = $Dato['Nombre'];
                     //QUERY USANDO EL ID DE LA CATEGORIA, A LA TABLA DE TIPOS DE EVENTOS
                    //QUERY USANDO EL ID DEL TIPO DE EVENTO, A LA TABLA DE TIPOS DE EVENTOS
                        $idTipoEvento = $Renglon['tipoEv'];
                        $Query = "SELECT * FROM tipo_evento WHERE ID =".$idTipoEvento;
                        $Result = mysqli_query($conexion,$Query);
                        $Dato = mysqli_fetch_array($Result);
                    $Eventos['tipoEvento'] = $Dato['Nombre'];
                    //QUERY USANDO EL ID DEL TIPO DE EVENTO, A LA TABLA DE TIPOS DE EVENTOS
                $Eventos['anio'] = substr($Renglon['inicio'],0,4);
                $Eventos['liberado'] = $Renglon['liberado'];
                array_push($Respuesta['eventos'],$Eventos);
            }
            $Respuesta['estatus'] = 1;
        }else{
                $Respuesta['estatus'] = 0;
        }
    
    echo json_encode($Respuesta);
}

function ActionBuscarEventoPHP($conexion){
    
    $idEvento = $_POST['idBuscar'];
    $Query = "SELECT * FROM eventos WHERE idEvento =".$idEvento;
    $Resultado = mysqli_query($conexion,$Query);
    $Respuesta[0] = array();
    $Respuesta[1] = array();
    $Renglon = mysqli_fetch_array($Resultado);

        if(mysqli_affected_rows($conexion) > 0){
        
            if($Renglon['NoRegistro'] == ""){
                array_push($Respuesta[0],"S/N"); 
            }else{
                array_push($Respuesta[0],$Renglon['NoRegistro']); 
            }

                //QUERY USANDO EL ID DEL TIPO DE EVENTO, A LA TABLA DE TIPOS DE EVENTOS
                    $idTipoEvento = $Renglon['tipoEv'];
                    $Query = "SELECT * FROM tipo_evento WHERE ID =".$idTipoEvento;
                    $Result = mysqli_query($conexion,$Query);
                    $Dato = mysqli_fetch_array($Result);
                    array_push($Respuesta[0],$Dato['Nombre']);
                //QUERY USANDO EL ID DEL TIPO DE EVENTO, A LA TABLA DE TIPOS DE EVENTOS
                //QUERY USANDO EL ID DE LA CATEGORIA, A LA TABLA DE TIPOS DE EVENTOS
                    $idCategoria = $Renglon['categoria'];
                    $Query = "SELECT * FROM categoria WHERE id =".$idCategoria;
                    $Result = mysqli_query($conexion,$Query);
                    $Dato = mysqli_fetch_array($Result);
                    array_push($Respuesta[0],$Dato['Nombre']);
                //QUERY USANDO EL ID DE LA CATEGORIA, A LA TABLA DE TIPOS DE EVENTOS
            array_push($Respuesta[0],$Renglon['Rama']);
            array_push($Respuesta[0],substr($Renglon['inicio'],0,10));
            array_push($Respuesta[0],substr($Renglon['final'],0,10));
            array_push($Respuesta[0],$Renglon['cantidadHoras']);
            array_push($Respuesta[0],$Renglon['modalidad']);
            array_push($Respuesta[0],$Renglon['publico']);
            array_push($Respuesta[0],$Renglon['origenPonentes']);
            array_push($Respuesta[0],"$".$Renglon['costoEvento'].".00");
            array_push($Respuesta[0],$Renglon['FormaDePago']);
                //QUERY PARA OBTENER LAS EVIDENCIAS
                $idEvento = $Renglon['idEvento'];
                $Query = "SELECT * FROM evidencias WHERE id =".$idEvento;
                $Result = mysqli_query($conexion,$Query);
                $Dato = array();
                    if(mysqli_affected_rows($conexion) > 0){
                        $Dato = mysqli_fetch_array($Result);
                        array_push($Respuesta[0],$Dato['numHombres']); 
                        array_push($Respuesta[0],$Dato['numMujeres']);
                        array_push($Respuesta[0],$Dato['numExpositores']);
                        $Respuesta[1]['evidenciaUno'] = $Dato['evidencia1'];
                        $Respuesta[1]['evidenciaDos'] = $Dato['evidencia2'];
                        $Respuesta[1]['pormenores']   = $Dato['pormenores'];            
                    }else{
                        array_push($Respuesta[0],"S/E"); 
                        array_push($Respuesta[0],"S/E");
                        array_push($Respuesta[0],"S/E");
                        $Respuesta[1]['evidenciaUno'] = "";
                        $Respuesta[1]['evidenciaDos'] = "";
                        $Respuesta[1]['pormenores']   = "";           
                    } 
                //QUERY PARA OBTENER LAS EVIDENCIAS

                //QUERY PARA SABER SI HAY DATOS GUARDADOS DE LA MEMORIA INSTITUCIONAL
                    $idEvento = $Renglon['idEvento'];
                    $Query = "SELECT * FROM memoria_institucional WHERE ID =".$idEvento;
                    $Result = mysqli_query($conexion,$Query);

                        if(mysqli_affected_rows($conexion) > 0){
                            $Renglon_memInst = mysqli_fetch_array($Result);
                            $Respuesta[1]['boolEditMemInst'] = 1;
                            $Respuesta[1]['EditMemInst'] = $Renglon_memInst['edicionMemInst'];  
                        }else{
                            $Respuesta[1]['boolEditMemInst'] = 0;
                        }
                //QUERY PARA SABER SI HAY DATOS GUARDADOS DE LA MEMORIA INSTITUCIONAL
            $Respuesta[1]['descripcionEvento'] = $Renglon['descripcion'];
            $Respuesta[1]['nombreEvento'] = $Renglon['titulo'];
            $Respuesta[1]['estatusLiberado'] = $Renglon['liberado'];
            $Respuesta['estatus'] = 1;
        }else{
                $Respuesta['estatus'] = 0;
        }
    
    echo json_encode($Respuesta);
}

function ActionAgregarEdicionPHP($conexion){

    $idEvento = $_POST['idEvento'];
    $texto = $_POST['texto'];
    $Respuesta['estatus'] = 0;
    //primero hay que checar si existe un dato anterior para saber si insertamos o actualizamos
    $Query = "SELECT * FROM memoria_institucional WHERE ID =".$idEvento;
    $Resultado = mysqli_query($conexion,$Query);

        if(mysqli_affected_rows($conexion) > 0){//Como si existe, actualizamos
            $Query = "UPDATE memoria_institucional SET edicionMemInst = '$texto' WHERE ID =".$idEvento;
            $Resultado = mysqli_query($conexion,$Query);
            $Respuesta = array();
            $Respuesta['accion'] = "UPDATE";
        
                if(mysqli_affected_rows($conexion) > 0){
                    $Respuesta['estatus'] = 1;
                }else{
                    $Respuesta['estatus'] = 0;
                }
        }else{//Como no existe, insertamos
            $Query = "INSERT INTO memoria_institucional (`ID`, `edicionMemInst`) VALUES ($idEvento,'$texto')";
            $Resultado = mysqli_query($conexion,$Query);
            $Respuesta = array();
            $Respuesta['accion'] = "INSERT";
        
                if(mysqli_affected_rows($conexion) > 0){
                    $Respuesta['estatus'] = 1;
                }else{
                    $Respuesta['estatus'] = 0;
                }
        }
    echo json_encode($Respuesta);
}

function ActionCambiarEstatusLiberadoPHP($conexion){

    $idEvento = $_POST['idEvento'];
    $estatus = $_POST['estatusActual'];

        if($estatus == 1){
            $estatus = 0;
        }else{
            $estatus = 1;
        }

    $Query = "UPDATE eventos SET liberado = $estatus WHERE idEvento =".$idEvento;
    $Resultado = mysqli_query($conexion,$Query);
    $Respuesta = array();
        if(mysqli_affected_rows($conexion) > 0){
            $Respuesta['estatus'] = 1;
            $Respuesta['estadoLiberado'] = $estatus;
        }else{
            $Respuesta['estatus'] = 0;
            $Respuesta['estadoLiberado'] = $estatus;
        }
    echo json_encode($Respuesta);
}
?>