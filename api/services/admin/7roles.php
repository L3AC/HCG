<?php
// Se incluye la clase del modelo.
require_once('../../models/data/10roles_data.php');

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
                    !$producto->setDescripcion($_POST['descripcionRol']) or
                    !$producto->setEstado(isset($_POST['estadoRol']) ? 1 : 0)  or
                    !$producto->setMarca(isset($_POST['estadoMarca']) ? 1 : 0)  or
                    !$producto->setModelo(isset($_POST['estadoModelo']) ? 1 : 0)  or
                    !$producto->setTalla(isset($_POST['estadoTalla']) ? 1 : 0)  or
                    !$producto->setPedido(isset($_POST['estadoPedido']) ? 1 : 0)  or
                    !$producto->setTipoNoticia(isset($_POST['estadoTipoNoticia']) ? 1 : 0)  or
                    !$producto->setNoticia(isset($_POST['estadoNoticia']) ? 1 : 0)  or
                    !$producto->setComentario(isset($_POST['estadoComentario']) ? 1 : 0)  or
                    !$producto->setCliente(isset($_POST['estadoCliente']) ? 1 : 0)  or
                    !$producto->setUsuario(isset($_POST['estadoUsuario']) ? 1 : 0)  or
                    !$producto->setRol(isset($_POST['estadopRol']) ? 1 : 0)  
                ) {
                    $result['error'] = $producto->getDataError();
                } elseif ($producto->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Registro creado correctamente';
                    // Se asigna el estado del archivo después de insertar.
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el registro';
                }
                break;
            case 'readAll':
                if ($result['dataset'] = $producto->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen registros';
                }
                break;
            case 'readOne':
                //echo $_POST['idTalla'];
                if (!$producto->setId($_POST['idRol'])) {
                    $result['error'] = $producto->getDataError();
                } elseif ($result['dataset'] = $producto->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Registro inexistente';
                }
                break;
                case 'fillSelect':
                    //echo $_POST['idTalla'];
                    if (!$producto->setId($_SESSION['idRol'])) {
                        $result['error'] = $producto->getDataError();
                    } elseif ($result['dataset'] = $producto->fillSelect()) {
                        $result['status'] = 1;
                    } else {
                        $result['error'] = 'Registro inexistente';
                    }
                    break;
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$producto->setId($_POST['idRol']) or
                    !$producto->setDescripcion($_POST['descripcionRol']) or
                    !$producto->setEstado(isset($_POST['estadoRol']) ? 1 : 0)  or
                    !$producto->setMarca(isset($_POST['estadoMarca']) ? 1 : 0)  or
                    !$producto->setModelo(isset($_POST['estadoModelo']) ? 1 : 0)  or
                    !$producto->setTalla(isset($_POST['estadoTalla']) ? 1 : 0)  or
                    !$producto->setPedido(isset($_POST['estadoPedido']) ? 1 : 0)  or
                    !$producto->setTipoNoticia(isset($_POST['estadoTipoNoticia']) ? 1 : 0)  or
                    !$producto->setNoticia(isset($_POST['estadNoticia']) ? 1 : 0)  or
                    !$producto->setComentario(isset($_POST['estadoComentario']) ? 1 : 0)  or
                    !$producto->setCliente(isset($_POST['estadoCliente']) ? 1 : 0)  or
                    !$producto->setUsuario(isset($_POST['estadoUsuario']) ? 1 : 0)  or
                    !$producto->setRol(isset($_POST['estadoRol']) ? 1 : 0)  
                ) {
                    $result['error'] = $producto->getDataError();
                } elseif ($producto->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Registro modificado correctamente';
                    // Se asigna el estado del archivo después de actualizar.
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el producto';
                }
                break;
            case 'deleteRow':
                if (
                    !$producto->setId($_POST['idTalla']) 
                ) {
                    $result['error'] = $producto->getDataError();
                } elseif ($producto->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Producto eliminado correctamente';
                    // Se asigna el estado del archivo después de eliminar.
                    $result['fileStatus'] = Validator::deleteFile($producto::RUTA_IMAGEN, $producto->getFilename());
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
