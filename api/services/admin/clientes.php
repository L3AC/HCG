<?php

// Se incluye la clase del modelo.
require_once('../../models/data/clientes_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario, se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $cliente = new ClienteData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'username' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idUsuario'])) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
                // Buscar filas que coincidan con un valor de búsqueda.
            case 'searchRows':
                if (!$cliente->setSearch($_POST['valor'])) {
                    $result['error'] = $cliente->getDataError();
                } elseif ($result['dataset'] = $cliente->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
                // Crear un nuevo registro de cliente.
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$cliente->setNombre($_POST['nombreCliente']) ||
                    !$cliente->setApellido($_POST['apellidoCliente']) ||
                    !$cliente->setCorreo($_POST['correoCliente']) ||
                    !$cliente->setTelefono($_POST['telefonoCliente']) ||
                    !$cliente->setUsuario($_POST['aliasCliente']) ||
                    !$cliente->setClave($_POST['claveCliente'])
                ) {
                    $result['error'] = $cliente->getDataError();
                } elseif ($cliente->readExist($_POST['aliasCliente'])) {
                    $result['error'] = 'El nombre de usuario ya está en uso';
                } elseif ($cliente->readExistMail($_POST['correoCliente'])) {
                    $result['error'] = 'El correo electrónico ya está en uso';
                } elseif ($_POST['claveCliente'] != $_POST['confirmarClave']) {
                    $result['error'] = 'Contraseñas diferentes';
                } elseif ($cliente->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Registro creado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el registro';
                }
                break;
                // Leer todos los registros de clientes.
            case 'readAll':
                if ($result['dataset'] = $cliente->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen administradores registrados';
                }
                break;
            case 'readClientesPedidos':
                if ($result['dataset'] = $cliente->readClientesPedidos()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen administradores registrados';
                }
                break;
                // Verificar si existe un usuario.
            case 'readExist':
                if ($cliente->readExist($_POST['usuario'])) {
                    $result['status'] = 1;
                } else {
                    $result['status'] = 2;
                }
                break;
                // Leer un registro específico de cliente.
            case 'readOne':
                if (!$cliente->setId($_POST['idCliente'])) {
                    $result['error'] = 'Registro incorrecto';
                } elseif ($result['dataset'] = $cliente->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Registro inexistente';
                }
                break;
                // Actualizar un registro de cliente existente.
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$cliente->setId($_POST['idCliente']) ||
                    !$cliente->setNombre($_POST['nombreCliente']) ||
                    !$cliente->setApellido($_POST['apellidoCliente']) ||
                    !$cliente->setCorreoNew($_POST['correoClienteNew']) ||
                    !$cliente->setCorreo($_POST['correoCliente']) ||
                    !$cliente->setTelefono($_POST['telefonoCliente']) ||
                    !$cliente->setEstado(isset($_POST['estadoCliente']) ? 1 : 0)
                ) {
                    $result['error'] = $cliente->getDataError();
                } elseif ($_POST['correoClienteNew'] != $_POST['correoCliente'] && $cliente->readExistMail($_POST['correoCliente'])) {
                    $result['error'] = 'El correo electrónico ya está en uso';
                } elseif ($cliente->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Registro modificado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el registro';
                }
                break;
                // Eliminar un registro de cliente.
            case 'deleteRow':
                if (!$cliente->setId($_POST['idCliente'])) {
                    $result['error'] = $cliente->getDataError();
                } elseif ($cliente->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Registro eliminado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el cliente';
                }
                break;
                // Obtener el nombre de usuario.
            case 'getUser':
                if (isset($_SESSION['usuarion'])) {
                    $result['status'] = 1;
                    $result['username'] = $_SESSION['usuarion'];
                } else {
                    $result['error'] = 'Alias indefinido';
                }
                break;
                // Cerrar la sesión.
            case 'logOut':
                if (session_destroy()) {
                    $result['status'] = 1;
                    $result['message'] = 'Sesión eliminada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al cerrar la sesión';
                }
                break;
                // Leer el perfil del usuario.
            case 'readProfile':
                if ($result['dataset'] = $cliente->readProfile()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Ocurrió un problema al leer el perfil';
                }
                break;
                // Editar el perfil del usuario.
            case 'editProfile':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$cliente->setNombre($_POST['nombreAdministrador']) ||
                    !$cliente->setApellido($_POST['apellidoAdministrador']) ||
                    !$cliente->setCorreo($_POST['correoAdministrador']) ||
                    !$cliente->setUsuario($_POST['aliasAdministrador'])
                ) {
                    $result['error'] = $cliente->getDataError();
                } elseif ($cliente->editProfile()) {
                    $result['status'] = 1;
                    $result['message'] = 'Perfil modificado correctamente';
                    $_SESSION['aliasAdministrador'] = $_POST['aliasAdministrador'];
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el perfil';
                }
                break;
                // Acción no disponible dentro de la sesión.
                case 'prediccionClientes':
                    if (
                        !$cliente->setId($_POST['limit'])
                    ) {
                        $result['error'] = $cliente->getDataError();
                    } elseif ($result['dataset'] = $cliente->prediccionClientes()) {
                        $result['status'] = 1;
                    } else {
                        $result['error'] = 'No hay datos disponibles';
                    }
                    break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
    } else {
        // Se compara la acción a realizar cuando el administrador no ha iniciado sesión.
        switch ($_GET['action']) {
                // Leer todos los usuarios (requiere autenticación).
            case 'readUsers':
                if ($cliente->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Debe autenticarse para ingresar';
                } else {
                    $result['error'] = 'Debe crear un administrador para comenzar';
                }
                break;
                // Registrar un nuevo administrador.
            case 'signUp':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$cliente->setNombre($_POST['nombre']) ||
                    !$cliente->setApellido($_POST['apellido']) ||
                    !$cliente->setCorreo($_POST['correo']) ||
                    !$cliente->setUsuario($_POST['usuario']) ||
                    !$cliente->setTelefono($_POST['telefono']) ||
                    !$cliente->setClave($_POST['clave'])
                ) {
                    $result['error'] = $cliente->getDataError();
                } elseif ($cliente->readExist($_POST['usuarioCliente'])) {
                    $result['error'] = 'El nombre de usuario ya está en uso';
                } elseif ($cliente->readExistMail($_POST['correoCliente'])) {
                    $result['error'] = 'El correo electrónico ya está en uso';
                } elseif ($_POST['clave'] != $_POST['confirmarClave']) {
                    $result['error'] = 'Contraseñas diferentes';
                } elseif ($cliente->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Administrador registrado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el registro';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible';
        }
    }
    // Se obtiene la excepción del servidor de base de datos por si ocurrió un problema.
    $result['exception'] = Database::getException();
    // Se indica el tipo de contenido a devolver y se imprime el resultado en formato JSON.
    header('Content-Type: application/json; charset=utf-8');
    print(json_encode($result));
} else {
    print(json_encode('Recurso no disponible'));
}
