<?php
// Se incluye la clase del modelo.
require_once('../../models/data/8detalleproductos_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $producto = new DetalleProductoData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idUsuario'])) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            case 'searchRows':
                if ($result['dataset'] = $producto->searchRows($_POST['valor'])) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                }
                break;
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$producto->setIdItem($_POST['idItem'])or 
                    !$producto->setCantidad($_POST['cantidadItem']))
                 {
                    $result['error'] = $producto->getDataError();
                } elseif ($producto->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Registro creado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el registro';
                }
                break;
                case 'subcreateRow':
                    $_POST = Validator::validateForm($_POST);
                    if (
                        !$producto->setIdProducto($_POST['idProducto'])or
                        !$producto->setIdItem($_POST['idItem'])or 
                        !$producto->setCantidad($_POST['cantidadItem']))
                     {
                        $result['error'] = $producto->getDataError();
                    } elseif ($producto->subcreateRow()) {
                        $result['status'] = 1;
                        $result['message'] = 'Registro creado correctamente';
                    } else {
                        $result['error'] = 'Ocurrió un problema al crear el registro';
                    }
                    break;
            /*case 'readAll':
                if (!$producto->setIdModelo($_SESSION['idmod'])) {
                    $result['error'] = $producto->getDataError();
                } elseif ($result['dataset'] = $producto->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = ' No se encontraron registros';
                }
                break;*/
            case 'readByProducto':
                if (!$producto->setIdProducto($_POST['idProducto'])) {
                    $result['error'] = $producto->getDataError();
                } elseif ($result['dataset'] = $producto->readByProducto()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'Tallas no registradas';
                }
                break;
            case 'readOne':
                if (!$producto->setId($_POST['idDetalleProducto'])) {
                    $result['error'] = $producto->getDataError();
                } elseif ($result['dataset'] = $producto->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Producto inexistente';
                }
                break;
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$producto->setId($_POST['idDetalleProducto']) or
                    !$producto->setCantidad($_POST['cantidadItem'])
                ) {
                    $result['error'] = $producto->getDataError();
                } elseif ($producto->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Registro modificado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el registro';
                }
                break;
            case 'deleteRow':
                if (
                    !$producto->setId($_POST['idDetalleProducto'])
                ) {
                    $result['error'] = $producto->getDataError();
                } elseif ($producto->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Producto eliminado correctamente';
                    
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el producto';
                }
                break;
            case 'cantidadProductosCategoria':
                if ($result['dataset'] = $producto->cantidadProductosCategoria()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No hay datos disponibles';
                }
                break;
            case 'porcentajeProductosCategoria':
                if ($result['dataset'] = $producto->porcentajeProductosCategoria()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No hay datos disponibles';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
        // Se obtiene la excepción del servidor de base de datos por si ocurrió un problema.
        $result['exception'] = Database::getException();
        // Se indica el tipo de contenido a mostrar y su respectivo conjunto de caracteres.
        header('Content-type: application/json; charset=utf-8');
        // Se imprime el resultado en formato JSON y se retorna al controlador.
        print(json_encode($result));
    } else {
        print(json_encode('Acceso denegado'));
    }
} else {
    print(json_encode('Recurso no disponible'));
}
