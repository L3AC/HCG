
<?php
// Se incluye la clase del modelo.
require_once('../../models/data/pedidos_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $producto = new PedidoData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idUsuario'])) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            case 'searchRows':
                if (
                    !$producto->setSearch($_POST['valor']) or
                    !$producto->setEstado($_POST['estado'])
                ) {
                    $result['error'] = $producto->getDataError();
                } elseif ($result['dataset'] = $producto->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$producto->setNombre($_POST['nombreModelo']) or
                    !$producto->setCategoria($_POST['marcaModelo']) or
                    !$producto->setEstado(isset($_POST['estadoModelo']) ? 1 : 0) or
                    !$producto->setImagen($_FILES['imagenModelo'])
                ) {
                    $result['error'] = $producto->getDataError();
                } elseif ($producto->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Producto creado correctamente';
                    // Se asigna el estado del archivo después de insertar.
                    $result['fileStatus'] = Validator::saveFile($_FILES['imagenProducto'], $producto::RUTA_IMAGEN);
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el producto';
                }
                break;
            case 'readAll':
                if ($result['dataset'] = $producto->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = ' No se encontraron registros';
                }
                break;
            case 'readEstadoPedidos':
                if ($result['dataset'] = $producto->readEstadoPedidos()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = ' No se encontraron registros';
                }
                break;
            case 'readEstadosTodosPedidos':
                if ($result['dataset'] = $producto->readEstadosTodosPedidos()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = ' No se encontraron registros';
                }
                break;
            case 'readsubAll':
                if (!$producto->setId($_SESSION['idmod'])) {
                    $result['error'] = $producto->getDataError();
                } elseif ($result['dataset'] = $producto->readsubAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'Tallas no registradas';
                }
                break;

            case 'readOne':
                if (!$producto->setId($_POST['idPedido'])) {
                    $result['error'] = $producto->getDataError();
                } elseif ($result['dataset'] = $producto->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Producto inexistente';
                }
                break;

                /*case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$producto->setId($_POST['idProducto']) or
                    !$producto->setFilename() or
                    !$producto->setNombre($_POST['nombreProducto']) or
                    !$producto->setDescripcion($_POST['descripcionProducto']) or
                    !$producto->setPrecio($_POST['precioProducto']) or
                    !$producto->setCategoria($_POST['categoriaProducto']) or
                    !$producto->setEstado(isset($_POST['estadoProducto']) ? 1 : 0) or
                    !$producto->setImagen($_FILES['imagenProducto'], $producto->getFilename())
                ) {
                    $result['error'] = $producto->getDataError();
                } elseif ($producto->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Producto modificado correctamente';
                    // Se asigna el estado del archivo después de actualizar.
                    $result['fileStatus'] = Validator::changeFile($_FILES['imagenProducto'], $producto::RUTA_IMAGEN, $producto->getFilename());
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el producto';
                }
                break;*/
            case 'deleteRow':
                if (
                    !$producto->setId($_POST['idPedido'])
                ) {
                    $result['error'] = $producto->getDataError();
                } elseif ($producto->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Pedido eliminado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el pedido';
                }
                break;
            case 'confirmRow':
                if (
                    !$producto->setId($_POST['idPedido'])
                ) {
                    $result['error'] = $producto->getDataError();
                } elseif ($producto->confirmRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Pedido finalizado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al finalizar el pedido';
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
