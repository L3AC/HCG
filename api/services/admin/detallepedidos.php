<?php

// Se incluye la clase del modelo.
require_once('../../models/data/detallepedidos_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $detalle = new DetallePedidoData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'fileStatus' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idUsuario'])) {
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
                // Buscar filas que coincidan con un valor de búsqueda.
            case 'searchRows':
                if (!$detalle->setId($_POST['idPedido'])) {
                    $result['error'] = $detalle->getDataError();
                } elseif ($result['dataset'] = $detalle->searchRows($_POST['valor'])) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay datos disponibles';
                }
                break;
                // Crear un nuevo registro de producto.
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$detalle->setNombre($_POST['nombreModelo']) or
                    !$detalle->setDescripcion($_POST['descripcionModelo']) or
                    !$detalle->setCategoria($_POST['marcaModelo']) or
                    !$detalle->setEstado(isset($_POST['estadoModelo']) ? "A" : "I") or
                    !$detalle->setImagen($_FILES['imagenModelo'])
                ) {
                    $result['error'] = $detalle->getDataError();
                } elseif ($detalle->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Producto creado correctamente';
                    // Se asigna el estado del archivo después de insertar.
                    $result['fileStatus'] = Validator::saveFile($_FILES['imagenProducto'], $detalle::RUTA_IMAGEN);
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el producto';
                }
                break;
                // Leer todos los registros de productos.
            case 'readAll':
                if (!$detalle->setIdModelo($_POST['idPedido'])) {
                    $result['error'] = $detalle->getDataError();
                } elseif ($result['dataset'] = $detalle->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No se encontraron registros';
                }
                break;
                // Leer un registro específico de producto.
            case 'readOne':
                if (!$detalle->setId($_POST['idDetallePedido'])) {
                    $result['error'] = $detalle->getDataError();
                } elseif ($result['dataset'] = $detalle->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Producto inexistente';
                }
                break;
                // Actualizar un registro de producto existente.
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$detalle->setId($_POST['idProducto']) or
                    !$detalle->setFilename() or
                    !$detalle->setNombre($_POST['nombreProducto']) or
                    !$detalle->setDescripcion($_POST['descripcionProducto']) or
                    !$detalle->setPrecio($_POST['precioProducto']) or
                    !$detalle->setCategoria($_POST['categoriaProducto']) or
                    !$detalle->setEstado(isset($_POST['estadoProducto']) ? 1 : 0) or
                    !$detalle->setImagen($_FILES['imagenProducto'], $detalle->getFilename())
                ) {
                    $result['error'] = $detalle->getDataError();
                } elseif ($detalle->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Producto modificado correctamente';
                    // Se asigna el estado del archivo después de actualizar.
                    $result['fileStatus'] = Validator::changeFile($_FILES['imagenProducto'], $detalle::RUTA_IMAGEN, $detalle->getFilename());
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el producto';
                }
                break;
                // Eliminar un registro de producto.
            case 'deleteRow':
                if (
                    !$detalle->setId($_POST['idProducto']) or
                    !$detalle->setFilename()
                ) {
                    $result['error'] = $detalle->getDataError();
                } elseif ($detalle->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Producto eliminado correctamente';
                    // Se asigna el estado del archivo después de eliminar.
                    $result['fileStatus'] = Validator::deleteFile($detalle::RUTA_IMAGEN, $detalle->getFilename());
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el producto';
                }
                break;
                // Obtener la cantidad de productos por categoría.
            case 'cantidadProductosCategoria':
                if ($result['dataset'] = $detalle->cantidadProductosCategoria()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No hay datos disponibles';
                }
                break;
                // Obtener el porcentaje de productos por categoría.
            case 'porcentajeProductosCategoria':
                if ($result['dataset'] = $detalle->porcentajeProductosCategoria()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No hay datos disponibles';
                }
                break;
            case 'topClientes':
                if (
                    !$detalle->setId($_POST['limit'])
                ) {
                    $result['error'] = $detalle->getDataError();
                } elseif ($result['dataset'] = $detalle->topClientes()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No hay datos disponibles';
                }
                break;
            case 'topComplementos':
                if (
                    !$detalle->setId($_POST['limit'])
                ) {
                    $result['error'] = $detalle->getDataError();
                } elseif ($result['dataset'] = $detalle->topComplementos()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No hay datos disponibles';
                }
                break;
            case 'topConjuntos':
                if (
                    !$detalle->setId($_POST['limit'])
                ) {
                    $result['error'] = $detalle->getDataError();
                } elseif ($result['dataset'] = $detalle->topConjuntos()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No hay datos disponibles';
                }
                break;
            case 'topCategorias':
                if (
                    !$detalle->setId($_POST['limit'])
                ) {
                    $result['error'] = $detalle->getDataError();
                } elseif ($result['dataset'] = $detalle->topCategorias()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No hay datos disponibles';
                }
                break;
            case 'topHorarios':
                if (
                    !$detalle->setId($_POST['limit'])
                ) {
                    $result['error'] = $detalle->getDataError();
                } elseif ($result['dataset'] = $detalle->topHorarios()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No hay datos disponibles';
                }
                break;
            case 'prediccionGanancia':
                if (
                    !$detalle->setId($_POST['limit'])
                ) {
                    $result['error'] = $detalle->getDataError();
                } elseif ($result['dataset'] = $detalle->prediccionGanancia()) {
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
