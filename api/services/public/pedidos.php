<?php
// Se incluye la clase del modelo.
require_once('../../models/data/pedidos_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    if (isset($_GET['app'])) {
    } else {
        // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
        session_start();
    }

    // Se instancia la clase correspondiente.
    $pedido = new PedidoData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'error' => null, 'exception' => null, 'dataset' => null);
    // Se verifica si existe una sesión iniciada como cliente para realizar las acciones correspondientes.
    if (isset($_SESSION['idCliente'])) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un cliente ha iniciado sesión.
        switch ($_GET['action']) {
                // Acción para agregar un producto al carrito de compras.
            case 'createDetail':
                $_POST = Validator::validateForm($_POST);
                if (!$pedido->startOrder()) {
                    $result['error'] = 'Ocurrió un problema al iniciar el pedido';
                } elseif (
                    !$pedido->setIdProducto($_POST['idProducto']) or
                    !$pedido->setCantidad($_POST['cantidadProducto']) or
                    !$pedido->setNota($_POST['notaProducto'])
                ) {
                    $result['error'] = $pedido->getDataError();
                } else {
                    $respuesta = $pedido->createDetail();
                    if ($respuesta == 1) {
                        $result['status'] = 1;
                        $result['message'] = 'Registro exitoso';
                    }
                    if ($respuesta == 2) {
                        $result['status'] = 2;
                        $result['message'] = 'Solo se permite tener 3 existencias por producto';
                    } else {
                        $result['error'] = 'Ocurrió un problema al crear el registro';
                    }
                }
                break;
                // Acción para obtener los productos agregados en el carrito de compras.
            case 'readDetail':
                if (!$pedido->getOrder()) {
                    $result['error'] = 'No ha agregado productos al carrito';
                } elseif ($result['dataset'] = $pedido->readDetail()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = ' no existen registrosen el carrito';
                }
                break;
            case 'searchRows':
                if (
                    !$pedido->setSearch($_POST['valor']) or
                    !$pedido->setEstado($_POST['estado'])
                ) {
                    $result['error'] = $pedido->getDataError();
                } elseif ($result['dataset'] = $pedido->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                }
                break;
            case 'searchByCliente':
                if (
                    !$pedido->setSearch($_POST['valor']) or
                    !$pedido->setEstado($_POST['estado'])
                ) {
                    $result['error'] = $pedido->getDataError();
                } elseif ($result['dataset'] = $pedido->searchByCliente()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                }
                break;

                case 'readOne':
                    if (!$pedido->setId($_POST['idPedido'])) {
                        $result['error'] = $pedido->getDataError();
                    } elseif ($result['dataset'] = $pedido->readOne()) {
                        $result['status'] = 1;
                    } else {
                        $result['error'] = 'Pedido inexistente';
                    }
                    break;
                // Acción para finalizar el carrito de compras.
            case 'finishOrder':
                if ($pedido->finishOrder()) {
                    $result['status'] = 1;
                    $result['message'] = 'Pedido finalizado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al finalizar el pedido';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
    } else {
        // Se compara la acción a realizar cuando un cliente no ha iniciado sesión.
        switch ($_GET['action']) {
            case 'createDetail':
                $result['error'] = 'Debe iniciar sesión para agregar el producto al carrito';
                break;
            case 'createDetailM':
                $_POST = Validator::validateForm($_POST);
                if (!$pedido->setIdCliente($_POST['idCliente'])) {
                    $result['error'] = $pedido->getDataError();
                } elseif (!$pedido->startOrderM()) {
                    $result['error'] = 'Ocurrió un problema al iniciar el pedido';
                } elseif (
                    !$pedido->setIdProducto($_POST['idProducto']) ||
                    !$pedido->setCantidad($_POST['cantidadModelo'])
                ) {
                    $result['error'] = $pedido->getDataError();
                } else {
                    $respuesta = $pedido->createDetailM();
                    if ($respuesta['status'] == 1) {
                        $result['status'] = 1;
                        $result['message'] = 'Registro exitoso';
                        $result['idPedido'] = $respuesta['idPedido'];
                    } elseif ($respuesta['status'] == 2) {
                        $result['status'] = 2;
                        $result['message'] = 'Solo se permite tener 3 existencias por producto';
                    } else {
                        $result['error'] = 'Ocurrió un problema al crear el registro';
                    }
                }
                break;
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
