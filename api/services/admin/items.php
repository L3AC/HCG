<?php
// Se incluye la clase del modelo.
require_once('../../models/data/items_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $item = new ItemData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idUsuario'])) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            case 'searchRows':
                if (
                    !$item->setSearch($_POST['valor'])
                ) {
                    $result['error'] = $item->getDataError();
                } elseif ($result['dataset'] = $item->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$item->setNombre($_POST['nombreItem']) or
                    !$item->setIdTipoItem($_POST['tipoItem']) or
                    !$item->setEstado(isset($_POST['estadoItem']) ? 1 : 0)
                ) {
                    $result['error'] = $item->getDataError();
                } elseif ($item->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Producto creado correctamente';
                    // Se asigna el estado del archivo después de insertar.
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el producto';
                }
                break;
            case 'readAll':
                if ($result['dataset'] = $item->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = ' No se encontraron registros';
                }
                break;
            case 'readAllActive':
                if ($result['dataset'] = $item->readAllActive()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = ' No se encontraron registros';
                }
                break;
            case 'readAllNot':
                //echo $_POST['idTalla'];
                if (!$item->setIdProducto($_POST['idProducto'])) {
                    $result['error'] = $item->getDataError();
                } elseif ($result['dataset'] = $item->readAllNot($_POST['busqueda'])) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Registros inexistentes';
                }
                break;
            case 'readOne':
                //echo $_POST['idTalla'];
                if (!$item->setId($_POST['idItem'])) {
                    $result['error'] = $item->getDataError();
                } elseif ($result['dataset'] = $item->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Producto inexistente';
                }
                break;
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$item->setId($_POST['idItem']) or
                    !$item->setNombre($_POST['nombreItem']) or
                    !$item->setIdTipoItem($_POST['tipoItem']) or
                    !$item->setEstado(isset($_POST['estadoItem']) ? 1 : 0)
                ) {
                    $result['error'] = $item->getDataError();
                } elseif ($item->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Registro modificado correctamente';
                    // Se asigna el estado del archivo después de actualizar.
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el producto';
                }
                break;
            case 'deleteRow':
                if (!$item->setId($_POST['idItem'])) {
                    $result['error'] = $item->getDataError();
                } else {
                    // Llamamos a deleteRow(), que ahora también devuelve los datos del item
                    $itemData = $item->deleteRow();

                    if ($itemData) {
                        // Si el item fue eliminado correctamente, muestra la descripción en el mensaje
                        $result['status'] = 1;
                        $result['message'] = 'Item "' . $itemData['descripcion_item'] . '" eliminado correctamente';
                    } else {
                        $result['error'] = 'Ocurrió un problema al eliminar el item';
                    }
                }
                break;

            case 'cantidadProductosCategoria':
                if ($result['dataset'] = $item->cantidadProductosCategoria()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No hay datos disponibles';
                }
                break;
            case 'porcentajeProductosCategoria':
                if ($result['dataset'] = $item->porcentajeProductosCategoria()) {
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
