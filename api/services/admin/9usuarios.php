<?php

// Se incluye la clase del modelo.
require_once('../../models/data/9usuarios_data.php');

// Se comprueba si existe una acción a realizar, de lo contrario se finaliza el script con un mensaje de error.
if (isset($_GET['action'])) {
    // Se crea una sesión o se reanuda la actual para poder utilizar variables de sesión en el script.
    session_start();
    // Se instancia la clase correspondiente.
    $administrador = new AdministradorData;
    // Se declara e inicializa un arreglo para guardar el resultado que retorna la API.
    $result = array('status' => 0, 'session' => 0, 'message' => null, 'dataset' => null, 'error' => null, 'exception' => null, 'username' => null);
    // Se verifica si existe una sesión iniciada como administrador, de lo contrario se finaliza el script con un mensaje de error.
    if (isset($_SESSION['idUsuario'])) {
        $result['session'] = 1;
        // Se compara la acción a realizar cuando un administrador ha iniciado sesión.
        switch ($_GET['action']) {
            case 'searchRows':
                if ($result['dataset'] = $administrador->searchRows($_SESSION['idRol'], $_POST['valor']/*,$_POST['valor2'],$_POST['valor3'],*/)) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                }
                break;
            case 'fillTab':
                if ($result['dataset'] = $administrador->fillTab($_SESSION['idRol'])) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No existen administradores registrados';
                }
                break;
            case 'createRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$administrador->setIdRol($_POST['rolUsuario']) or
                    !$administrador->setNombre($_POST['nombreAdministrador']) or
                    !$administrador->setApellido($_POST['apellidoAdministrador']) or
                    !$administrador->setCorreo($_POST['correoAdministrador']) or
                    !$administrador->setAlias($_POST['aliasAdministrador']) or
                    !$administrador->setClave($_POST['claveAdministrador'])
                ) {
                    $result['error'] = $administrador->getDataError();
                } elseif ($_POST['claveAdministrador'] != $_POST['confirmarClave']) {
                    $result['error'] = 'Contraseñas diferentes';
                } elseif ($administrador->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Administrador creado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el administrador';
                }
                break;
            case 'readAll':
                if ($result['dataset'] = $administrador->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                    $result['username'] = $_SESSION['usuarion'];
                } else {
                    $result['error'] = 'No existen administradores registrados';
                }
                break;
            case 'readExist':
                if ($administrador->readExist($_POST['usuario'])) {
                    $result['status'] = 1;
                } else {
                    $result['status'] = 2;
                }
                break;
            case 'readOne':
                if (!$administrador->setId($_POST['idAdministrador'])) {
                    $result['error'] = 'Administrador incorrecto';
                } elseif ($result['dataset'] = $administrador->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Administrador inexistente';
                }
                break;
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$administrador->setId($_POST['id_usuario']) or
                    !$administrador->setNombre($_POST['nombres']) or
                    !$administrador->setApellido($_POST['apellidos']) or
                    !$administrador->setCorreo($_POST['email'])
                ) {
                    $result['error'] = $administrador->getDataError();
                } elseif ($administrador->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Administrador modificado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el administrador';
                }
                break;
            case 'deleteRow':
                if ($_POST['idAdministrador'] == $_SESSION['idAdministrador']) {
                    $result['error'] = 'No se puede eliminar a sí mismo';
                } elseif (!$administrador->setId($_POST['idAdministrador'])) {
                    $result['error'] = $administrador->getDataError();
                } elseif ($administrador->deleteRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Administrador eliminado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al eliminar el administrador';
                }
                break;
            case 'getUser':
                if (isset($_SESSION['usuarion'])) {
                    $result['status'] = 1;
                    $result['username'] = $_SESSION['usuarion'];
                    $result['idrol'] = $_SESSION['idRol'];
                    $result['marcas_opc'] = $_SESSION['marcas_opc'];
                    $result['modelos_opc'] = $_SESSION['modelos_opc'];
                    $result['tallas_opc'] = $_SESSION['tallas_opc'];
                    $result['pedidos_opc'] = $_SESSION['pedidos_opc'];
                    $result['tipo_noticias_opc'] = $_SESSION['tipo_noticias_opc'];
                    $result['noticias_opc'] = $_SESSION['noticias_opc'];
                    $result['comentarios_opc']   = $_SESSION['comentarios_opc'];
                    $result['clientes_opc']      = $_SESSION['clientes_opc'];
                    $result['usuarios_opc']      = $_SESSION['usuarios_opc'];
                    $result['roles_opc']         = $_SESSION['roles_opc'];
                } else {
                    $result['error'] = 'Alias de administrador indefinido';
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
                if ($result['dataset'] = $administrador->readProfile()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Ocurrió un problema al leer el perfil';
                }
                break;
            case 'editProfile':
                $_POST = Validator::validateForm($_POST);

                if (
                    !$administrador->setNombre($_POST['nombreAdministrador']) or
                    !$administrador->setApellido($_POST['apellidoAdministrador']) or
                    !$administrador->setCorreo($_POST['correoAdministrador']) or
                    !$administrador->setAlias($_POST['aliasAdministrador'])
                ) {
                    $result['error'] = $administrador->getDataError();
                } elseif ($administrador->editProfile()) {
                    $result['status'] = 1;
                    $result['message'] = 'Perfil modificado correctamente';
                    $_SESSION['usuarion'] = $_POST['aliasAdministrador'];
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el perfil';
                }
                break;
            case 'changePassword':
                $_POST = Validator::validateForm($_POST);
                if (!$administrador->checkPassword($_POST['claveActual'])) {
                    $result['error'] = 'Contraseña actual incorrecta';
                } elseif ($_POST['claveNueva'] != $_POST['confirmarClave']) {
                    $result['error'] = 'Confirmación de contraseña diferente';
                } elseif (!$administrador->setClave($_POST['claveNueva'])) {
                    $result['error'] = $administrador->getDataError();
                } elseif ($administrador->changePassword()) {
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
        // Se compara la acción a realizar cuando el administrador no ha iniciado sesión.
        switch ($_GET['action']) {
            case 'readUsers':
                if ($administrador->readAll()) {
                    $result['status'] = 1;
                    //$result['message'] = 'Debe autenticarse para ingresar';
                } else {
                    $result['error'] = 'Debe crear un administrador para comenzar';
                }
                break;
            case 'signUp':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$administrador->setNombre($_POST['nombre']) or
                    !$administrador->setApellido($_POST['apellido']) or
                    !$administrador->setCorreo($_POST['correo']) or
                    !$administrador->setAlias($_POST['usuario']) or
                    !$administrador->setClave($_POST['clave'])
                ) {
                    $result['error'] = $administrador->getDataError();
                } elseif ($_POST['clave'] != $_POST['confirmarClave']) {
                    $result['error'] = 'Contraseñas diferentes';
                } elseif ($administrador->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Administrador registrado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al registrar el administrador';
                }
                break;
            case 'logIn':

                $_POST = Validator::validateForm($_POST);

                if ($administrador->checkUser($_POST['usuariol'], $_POST['clavel'])) {
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
