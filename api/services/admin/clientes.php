<?php

// Se incluye la clase del modelo.
require_once('../../models/data/clientes_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
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
            case 'searchRows':
                if (
                    !$cliente->setSearch($_POST['valor'])
                ) {
                    $result['error'] = $cliente->getDataError();
                } elseif ($result['dataset'] = $cliente->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$cliente->setNombre($_POST['nombreCliente']) or
                    !$cliente->setApellido($_POST['apellidoCliente']) or
                    !$cliente->setCorreo($_POST['correoCliente']) or
                    !$cliente->setTelefono($_POST['telefonoCliente']) or
                    !$cliente->setUsuario($_POST['aliasCliente']) or
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
            case 'readAll':
                if ($result['dataset'] = $cliente->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                } else {
                    $result['error'] = 'No existen administradores registrados';
                }
                break;
            case 'readExist':
                if ($cliente->readExist($_POST['usuario'])) {
                    $result['status'] = 1;
                } else {
                    $result['status'] = 2;
                }
                break;
            case 'readOne':
                if (!$cliente->setId($_POST['idCliente'])) {
                    $result['error'] = 'Registro incorrecto';
                } elseif ($result['dataset'] = $cliente->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Registro inexistente';
                }
                break;
                case 'updateRow':
                    $_POST = Validator::validateForm($_POST);
                    if (
                        !$cliente->setId($_POST['idCliente']) or
                        !$cliente->setNombre($_POST['nombreCliente']) or
                        !$cliente->setApellido($_POST['apellidoCliente']) or
                        !$cliente->setCorreoNew($_POST['correoClienteNew']) or
                        !$cliente->setCorreo($_POST['correoCliente']) or
                        !$cliente->setTelefono($_POST['telefonoCliente']) or
                        !$cliente->setEstado(isset($_POST['estadoCliente']) ? 1 : 0)
                    ) {
                        $result['error'] = $cliente->getDataError();
                    }  elseif ($_POST['correoClienteNew']!=$_POST['correoCliente'] && $cliente->readExistMail($_POST['correoCliente'])) {
                        $result['error'] = 'El correo electrónico ya está en uso';
                    }elseif ($cliente->updateRow()) {
                        $result['status'] = 1;
                        $result['message'] = 'Registro modificado correctamente';
                    } else {
                        $result['error'] = 'Ocurrió un problema al modificar el registro';
                    }
                    break;
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
            case 'getUser':
                if (isset($_SESSION['usuarion'])) {
                    $result['status'] = 1;
                    $result['username'] = $_SESSION['usuarion'];
                } else {
                    $result['error'] = 'Alias indefinido';
                }
                break;
            case 'logOut':
                if (session_destroy()) {
                    $result['status'] = 1;
                    $result['message'] = 'Sesión eliminada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al cerrar la sesión';
                }
                break;
            case 'readProfile':
                if ($result['dataset'] = $cliente->readProfile()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Ocurrió un problema al leer el perfil';
                }
                break;
            case 'editProfile':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$cliente->setNombre($_POST['nombreAdministrador']) or
                    !$cliente->setApellido($_POST['apellidoAdministrador']) or
                    !$cliente->setCorreo($_POST['correoAdministrador']) or
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
                /*case 'changePassword':
                $_POST = Validator::validateForm($_POST);
                if (!$cliente->checkPassword($_POST['claveActual'])) {
                    $result['error'] = 'Contraseña actual incorrecta';
                } elseif ($_POST['claveNueva'] != $_POST['confirmarClave']) {
                    $result['error'] = 'Confirmación de contraseña diferente';
                } elseif (!$cliente->setClave($_POST['claveNueva'])) {
                    $result['error'] = $cliente->getDataError();
                } elseif ($cliente->changePassword()) {
                    $result['status'] = 1;
                    $result['message'] = 'Contraseña cambiada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al cambiar la contraseña';
                }
                break;*/
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
    } else {
        // Se compara la acción a realizar cuando el administrador no ha iniciado sesión.
        switch ($_GET['action']) {
            case 'readUsers':
                if ($cliente->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Debe autenticarse para ingresar';
                } else {
                    $result['error'] = 'Debe crear un administrador para comenzar';
                }
                break;
            case 'signUp':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$cliente->setNombre($_POST['nombre']) or
                    !$cliente->setApellido($_POST['apellido']) or
                    !$cliente->setCorreo($_POST['correo']) or
                    !$cliente->setUsuario($_POST['usuario']) or
                    !$cliente->setTelefono($_POST['telefono']) or
                    !$cliente->setClave($_POST['clave'])
                ) {
                    $result['error'] = $cliente->getDataError();
                } elseif ($cliente->readExist($_POST['usuarioCliente'])) {
                    $result['error'] = 'El nombre de usuario ya está en uso';
                } elseif ($cliente->readExistMail($_POST['correoCliente'])) {
                    $result['error'] = 'El correo electrónico ya está en uso';
                }elseif ($_POST['clave'] != $_POST['confirmarClave']) {
                    $result['error'] = 'Contraseñas diferentes';
                } elseif ($cliente->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Administrador registrado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al registrar el administrador';
                }
                break;
            case 'logIn':

                $_POST = Validator::validateForm($_POST);

                if ($cliente->checkUser($_POST['usuariol'], $_POST['clavel'])) {
                    $result['status'] = 1;
                    $result['message'] = 'Autenticación correcta';
                } else {
                    $result['error'] = 'Credenciales incorrectas';
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
