<?php

// Se incluye la clase del modelo.
require_once('../../models/data/admin/6usuarios_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $Usuario = new UsuarioData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'username' => null);
    // Se verifica si existe una sesión iniciada como Usuario, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idUsuario'])) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un Usuario ha iniciado sesión.
        switch ($_GET['action']) {
            case 'searchRows':
                if ($result['dataset'] = $Usuario->searchRows($_SESSION['idRol'], $_POST['valor']/*,$_POST['valor2'],$_POST['valor3'],*/)) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                }
                break;
            case 'fillTab':
                if ($result['dataset'] = $Usuario->fillTab($_SESSION['idRol'])) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No existen Usuarios registrados';
                }
                break;
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$Usuario->setIdRol($_POST['rolUsuario']) or
                    !$Usuario->setNombre($_POST['nombreUsuario']) or
                    !$Usuario->setApellido($_POST['apellidoUsuario']) or
                    !$Usuario->setCorreo($_POST['correoUsuario']) or
                    !$Usuario->setAlias($_POST['aliasUsuario']) or
                    !$Usuario->setClave($_POST['claveUsuario']) or
                    !$Usuario->setEstado(isset($_POST['estadoUsuario']) ? 1 : 0) 
                ) {
                    $result['error'] = $Usuario->getDataError();
                } elseif ($_POST['claveUsuario'] != $_POST['confirmarClave']) {
                    $result['error'] = 'Contraseñas diferentes';
                } elseif ($Usuario->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Usuario creado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el Usuario';
                }
                break;
            case 'readAll':
                if ($result['dataset'] = $Usuario->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                    $result['username'] = $_SESSION['usuarion'];
                } else {
                    $result['error'] = 'No existen Usuarioes registrados';
                }
                break;
            case 'readExist':
                if ($Usuario->readExist($_POST['usuario'])) {
                    $result['status'] = 1;
                } else {
                    $result['status'] = 2;
                }
                break;
            case 'readOne':
                if (!$Usuario->setId($_POST['idUsuario'])) {
                    $result['error'] = 'Usuario incorrecto';
                } elseif ($result['dataset'] = $Usuario->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Usuario inexistente';
                }
                break;
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$Usuario->setId($_POST['idUsuario']) or
                    !$Usuario->setIdRol($_POST['rolUsuario']) or
                    !$Usuario->setNombre($_POST['nombreUsuario']) or
                    !$Usuario->setApellido($_POST['apellidoUsuario']) or
                    !$Usuario->setCorreo($_POST['correoUsuario']) or
                    !$Usuario->setAlias($_POST['aliasUsuario']) or
                    !$Usuario->setClave($_POST['claveUsuario']) or
                    !$Usuario->setEstado(isset($_POST['estadoUsuario']) ? 1 : 0) 
                ) {
                    $result['error'] = $Usuario->getDataError();
                } elseif ($Usuario->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Usuario modificado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el Usuario';
                }
                break;
            case 'deleteRow':
                if ($_POST['idUsuario'] == $_SESSION['idUsuario']) {
                    $result['error'] = 'No se puede eliminar a sí mismo';
                } elseif (!$Usuario->setId($_POST['idUsuario'])) {
                    $result['error'] = $Usuario->getDataError();
                } elseif ($Usuario->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Usuario eliminado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el Usuario';
                }
                break;
            case 'getUser':
                if (isset($_SESSION['alias'])) {
                    $result['status'] = 1;
                    $result['username'] = $_SESSION['alias'];
                    $result['idrol'] = $_SESSION['idRol'];
                    $result['productos_opc'] = $_SESSION['productos_opc'];
                    $result['pedidos_opc'] = $_SESSION['pedidos_opc'];
                    $result['tipo_items_opc'] = $_SESSION['tipo_items_opc'];
                    $result['items_opc'] = $_SESSION['items_opc'];
                    $result['clientes_opc'] = $_SESSION['clientes_opc'];
                    $result['usuarios_opc'] = $_SESSION['usuarios_opc'];
                    $result['roles_opc'] = $_SESSION['roles_opc'];
                } else {
                    $result['error'] = 'Alias de Usuario indefinido';
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
                if ($result['dataset'] = $Usuario->readProfile()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Ocurrió un problema al leer el perfil';
                }
                break;
            case 'editProfile':
                $_POST = Validator::validateForm($_POST);

                if (
                    !$Usuario->setNombre($_POST['nombreUsuario']) or
                    !$Usuario->setApellido($_POST['apellidoUsuario']) or
                    !$Usuario->setCorreo($_POST['correoUsuario']) or
                    !$Usuario->setAlias($_POST['aliasUsuario'])
                ) {
                    $result['error'] = $Usuario->getDataError();
                } elseif ($Usuario->editProfile()) {
                    $result['status'] = 1;
                    $result['message'] = 'Perfil modificado correctamente';
                    $_SESSION['usuarion'] = $_POST['aliasUsuario'];
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el perfil';
                }
                break;
            case 'changePassword':
                $_POST = Validator::validateForm($_POST);
                if (!$Usuario->checkPassword($_POST['claveActual'])) {
                    $result['error'] = 'Contraseña actual incorrecta';
                } elseif ($_POST['claveNueva'] != $_POST['confirmarClave']) {
                    $result['error'] = 'Confirmación de contraseña diferente';
                } elseif (!$Usuario->setClave($_POST['claveNueva'])) {
                    $result['error'] = $Usuario->getDataError();
                } elseif ($Usuario->changePassword()) {
                    $result['status'] = 1;
                    $result['message'] = 'Contraseña cambiada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al cambiar la contraseña';
                }
                break;
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
    } else {
        // Se compara la acción a realizar cuando el Usuario no ha iniciado sesión.
        switch ($_GET['action']) {
            case 'readUsers':
                if ($Usuario->readAll()) {
                    $result['status'] = 1;
                    //$result['message'] = 'Debe autenticarse para ingresar';
                } else {
                    $result['error'] = 'Debe crear un Usuario para comenzar';
                }
                break;
            case 'signUp':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$Usuario->setNombre($_POST['nombre']) or
                    !$Usuario->setApellido($_POST['apellido']) or
                    !$Usuario->setCorreo($_POST['correo']) or
                    !$Usuario->setAlias($_POST['usuario']) or
                    !$Usuario->setClave($_POST['clave'])
                ) {
                    $result['error'] = $Usuario->getDataError();
                } elseif ($_POST['clave'] != $_POST['confirmarClave']) {
                    $result['error'] = 'Contraseñas diferentes';
                } elseif ($Usuario->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Usuario registrado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al registrar el Usuario';
                }
                break;
            case 'logIn':

                $_POST = Validator::validateForm($_POST);

                if ($Usuario->checkUser($_POST['usuariol'], $_POST['clavel'])) {
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
