<?php
// Se incluye la clase del modelo.
require_once('../../models/data/clientes_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    /**if(isset($_GET['app'])){

    }
    else{*/
    session_start();
    //}
    // Se instancia la clase correspondiente.
    $cliente = new ClienteData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'recaptcha' => 0, 'message' => null, 'error' => null, 'exception' => null, 'username' => null);
    // Se verifica si existe una sesión iniciada como cliente para realizar las acciones correspondientes.
    if (isset($_SESSION['idCliente'])) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un cliente ha iniciado sesión.
        switch ($_GET['action']) {
            case 'getUser':
                if (isset($_SESSION['usuarioc'])) {
                    $result['status'] = 1;
                    $result['username'] = $_SESSION['usuarioc'];
                } else {
                    $result['error'] = 'Usuario indefinido';
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
                    !$cliente->setNombre($_POST['nombreCliente']) or
                    !$cliente->setApellido($_POST['apellidoCliente']) or
                    !$cliente->setCorreo($_POST['correoCliente']) or
                    !$cliente->setTelefono($_POST['telefonoCliente']) or
                    !$cliente->setUsuario($_POST['aliasCliente'])
                ) {
                    $result['error'] = $cliente->getDataError();
                } elseif ($_SESSION['usuarioc'] != $_POST['aliasCliente'] && $cliente->readExist($_POST['aliasCliente'])) {
                    $result['error'] = 'El nombre de usuario ya está en uso';
                } elseif ($_SESSION['correo'] != $_POST['correoCliente'] && $cliente->readExistMail($_POST['correoCliente'])) {
                    $result['error'] = 'El correo electrónico ya está en uso';
                } elseif ($cliente->editProfile()) {
                    $result['status'] = 1;
                    $result['message'] = 'Perfil modificado correctamente';
                    $_SESSION['usuarioc'] = $_POST['aliasCliente'];
                    $_SESSION['correo'] = $_POST['correoCliente'];
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el perfil';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
    } else {
        // Se compara la acción a realizar cuando el cliente no ha iniciado sesión.
        switch ($_GET['action']) {
            case 'changePassword':
                if (!isset($_SESSION['clienteRecup'])) {
                    $result['error'] = 'Acción no disponible';
                }elseif (!$cliente->checkPassword($_POST['claveActual'])) {
                    $result['error'] = 'Contraseña actual incorrecta';
                } elseif ($_POST['claveNueva'] != $_POST['confirmarClave']) {
                    $result['error'] = 'Confirmación de contraseña diferente';
                } elseif (!$cliente->setClave($_POST['claveNueva'])) {
                    $result['error'] = $cliente->getDataError();
                } elseif ($cliente->changePassword()) {
                    $result['status'] = 1;
                    $result['message'] = 'Contraseña modificada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al cambiar la contraseña';
                }
                break;
            case 'verifUs':
                if (!$cliente->setUsuario($_POST['aliasCliente'])) {
                    $result['error'] = $cliente->getDataError();
                } elseif ($result['dataset'] = $cliente->verifUs()) {
                    $result['status'] = 1;
                    $_SESSION['clienteRecup'] = $result['dataset']['id_cliente'];
                } else {
                    $result['error'] = 'Usuario inexistente';
                }
                break;
            case 'verifPin':
                if (!$cliente->setPin($_POST['pinCliente'])) {
                    $result['error'] = $cliente->getDataError();
                } elseif (!$result['dataset'] = $cliente->verifPin()) {
                    $result['error'] = 'Codigo incorrecto';
                }elseif ($cliente->updatePin()) {
                    $result['status'] = 1;
                } else {
                    
                }
                break;
            case 'signUp':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$cliente->setNombre($_POST['nombreCliente']) or
                    !$cliente->setApellido($_POST['apellidoCliente']) or
                    !$cliente->setTelefono($_POST['telefonoCliente']) or
                    !$cliente->setCorreo($_POST['correoCliente']) or
                    !$cliente->setUsuario($_POST['usuarioCliente']) or
                    !$cliente->setClave($_POST['claveCliente'])
                ) {
                    $result['error'] = $cliente->getDataError();
                } elseif ($_POST['claveCliente'] != $_POST['confirmarClave']) {
                    $result['error'] = 'Contraseñas diferentes';
                } elseif ($cliente->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Cuenta registrada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al registrar la cuenta';
                }
                break;
            case 'logIn':
                $_POST = Validator::validateForm($_POST);
                if (isset($_POST['usu']) && isset($_POST['clave'])) {
                    if (!$cliente->checkUser($_POST['usu'], $_POST['clave'])) {
                        $result['error'] = 'Datos incorrectos';
                    } elseif ($cliente->checkStatus()) {
                        $result['status'] = 1;
                        $result['message'] = 'Autenticación correcta';
                        $result['dataset'] = $_SESSION['idCliente'];
                    } else {
                        $result['error'] = 'La cuenta ha sido desactivada';
                    }
                } else {
                    $result['error'] = 'Usuario y/o contraseña no proporcionados';
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
