<?php
// Se incluye la clase del modelo.
require_once('../../models/data/detallepedidos_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    if (isset($_GET['app'])) {
    } else {
        // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
        session_start();
    }
    // Se instancia la clase correspondiente.
    $pedido = new DetallePedidoData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
    if (isset($_SESSION['idCliente'])) {
        $result['session'] = 1;
        switch ($_GET['action']) {
            case 'searchHistorial':
                if (
                    !$pedido->setSearch($_POST['valor'])
                ) {
                    $result['error'] = $pedido->getDataError();
                } elseif ($result['dataset'] = $pedido->searchHistorial()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'El historial esta vacío';
                }
                break;
                case 'updateRow':
                    $_POST = Validator::validateForm($_POST);
                    if (
                        !$pedido->setId($_POST['idDetallePedido']) or
                        !$pedido->setCantidad($_POST['cantidadPedido']) or
                        !$pedido->setNota($_POST['notaPedido'])
                    ) {
                        $result['error'] = $pedido->getDataError();
                    } elseif ($pedido->updateRow()) {
                        $result['status'] = 1;
                        $result['message'] = 'Registro modificado correctamente';
                    } else {
                        $result['error'] = 'Ocurrió un problema al modificar el registro';
                    }
                    break;
                case 'readOne':
                    if (!$pedido->setId($_POST['idDetallePedido'])) {
                        $result['error'] = $pedido->getDataError();
                    } elseif ($result['dataset'] = $pedido->readOne()) {
                        $result['status'] = 1;
                    } else {
                        $result['error'] = 'Detalle inexistente';
                    }
                    break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
    } else {
        // Se compara la acción a realizar cuando un cliente no ha iniciado sesión.
        switch ($_GET['action']) {
            
            default:
                $result['error'] = 'Acción no disponible fuera de la sesión';
        }
    }
    // Se obtiene la excepción del servidor de base de datos por si ocurrió un problema.
    $result['exception'] = Database::getException();
    // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
    header('Content-type: application/json; charset=utf-8');
    // Se imprime el resultado en formato JSON y se retorna al controlador.
    print(json_encode($result));
} else {
    print(json_encode('Recurso no disponible'));
}
