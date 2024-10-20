<?php

// Se incluye la clase del modelo.
require_once('../../models/data/roles_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $producto = new RolData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idUsuario'])) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            // Buscar filas que coincidan con un valor de búsqueda.
            case 'searchRows':
                if (!$producto->setSearch($_POST['valor'])) {
                    $result['error'] = $producto->getDataError();
                } elseif ($result['dataset'] = $producto->searchRows($_POST['valor'])) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;

            // Crear un nuevo registro de rol.
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$producto->setDescripcion($_POST['nombreRol']) or
                    !$producto->setEstado(isset($_POST['estadoRol']) ? 1 : 0) or
                    !$producto->setProducto(isset($_POST['estadoProducto']) ? 1 : 0) or
                    !$producto->setPedido(isset($_POST['estadoPedido']) ? 1 : 0) or
                    !$producto->setTipoItem(isset($_POST['estadoTipoItem']) ? 1 : 0) or
                    !$producto->setItem(isset($_POST['estadoItem']) ? 1 : 0) or
                    !$producto->setCliente(isset($_POST['estadoCliente']) ? 1 : 0) or
                    !$producto->setUsuario(isset($_POST['estadoUsuario']) ? 1 : 0)
                ) {
                    $result['error'] = $producto->getDataError();
                } elseif ($producto->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Registro creado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el registro';
                }
                break;

            // Leer todos los registros de roles.
            case 'readAll':
                if ($result['dataset'] = $producto->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen registros';
                }
                break;

            // Leer un registro específico de rol.
            case 'readOne':
                if (!$producto->setId($_POST['idRol'])) {
                    $result['error'] = $producto->getDataError();
                } elseif ($result['dataset'] = $producto->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Registro inexistente';
                }
                break;

            // Llenar un select con roles.
            case 'fillSelect':
                if (!$producto->setId($_SESSION['idRol'])) {
                    $result['error'] = $producto->getDataError();
                } elseif ($result['dataset'] = $producto->fillSelect()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Registro inexistente';
                }
                break;

            // Actualizar un registro de rol.
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$producto->setId($_POST['idRol']) or
                    !$producto->setDescripcion($_POST['nombreRol']) or
                    !$producto->setEstado(isset($_POST['estadoRol']) ? 1 : 0) or
                    !$producto->setProducto(isset($_POST['estadoProducto']) ? 1 : 0) or
                    !$producto->setPedido(isset($_POST['estadoPedido']) ? 1 : 0) or
                    !$producto->setTipoItem(isset($_POST['estadoTipoItem']) ? 1 : 0) or
                    !$producto->setItem(isset($_POST['estadoItem']) ? 1 : 0) or
                    !$producto->setCliente(isset($_POST['estadoCliente']) ? 1 : 0) or
                    !$producto->setUsuario(isset($_POST['estadoUsuario']) ? 1 : 0)
                ) {
                    $result['error'] = $producto->getDataError();
                } elseif ($producto->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Registro modificado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el producto';
                }
                break;

            // Eliminar un registro de rol.
            case 'deleteRow':
                if (!$producto->setId($_POST['idRol'])) {
                    $result['error'] = $producto->getDataError();
                } else {
                    // Llamamos a la función deleteRow(), que ahora devuelve la descripción
                    $rolData = $producto->deleteRow();
            
                    if ($rolData) {
                        // Si el rol fue eliminado correctamente, mostramos la descripción en el mensaje
                        $result['status'] = 1;
                        $result['message'] = 'Rol "' . $rolData['descripcion_rol'] . '" eliminado correctamente';
                        $result['fileStatus'] = Validator::deleteFile($producto::RUTA_IMAGEN, $producto->getFilename());
                    } else {
                        $result['error'] = 'Ocurrió un problema al eliminar el rol';
                    }
                }
                break;

            // Obtener la cantidad de productos por categoría (asociado a roles).
            case 'cantidadProductosCategoria':
                if ($result['dataset'] = $producto->cantidadProductosCategoria()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No hay datos disponibles';
                }
                break;

            // Obtener el porcentaje de productos por categoría (asociado a roles).
            case 'porcentajeProductosCategoria':
                if ($result['dataset'] = $producto->porcentajeProductosCategoria()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No hay datos disponibles';
                }
                break;

            // Acción no disponible dentro de la sesión.
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
?>
