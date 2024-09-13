<?php

// Se incluye la clase del modelo.
require_once('../../models/data/usuarios_data.php');

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
                // Buscar filas que coincidan con un valor de búsqueda.
            case 'searchRows':
                if (!$Usuario->setSearch($_POST['valor'])) {
                    $result['error'] = $Usuario->getDataError();
                } elseif ($result['dataset'] = $Usuario->searchRows()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No hay coincidencias';
                }
                break;

                // Llenar tabla de usuarios según el rol del usuario en sesión.
            case 'fillTab':
                if ($result['dataset'] = $Usuario->fillTab($_SESSION['idRol'])) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' coincidencias';
                } else {
                    $result['error'] = 'No existen Usuarios registrados';
                }
                break;

                // Crear un nuevo usuario.
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
                } elseif ($Usuario->readExist($_POST['aliasUsuario'])) {
                    $result['error'] = 'El nombre de usuario ya está en uso';
                } elseif ($Usuario->readExistMail($_POST['correoUsuario'])) {
                    $result['error'] = 'El correo electrónico ya está en uso';
                } elseif ($_POST['claveUsuario'] != $_POST['confirmarClave']) {
                    $result['error'] = 'Contraseñas diferentes';
                } elseif ($Usuario->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Usuario creado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al crear el Usuario';
                }
                break;

                // Leer todos los usuarios.
            case 'readAll':
                if ($result['dataset'] = $Usuario->readAll()) {
                    $result['status'] = 1;
                    $result['message'] = 'Existen ' . count($result['dataset']) . ' registros';
                    $result['username'] = $_SESSION['usuarion'];
                } else {
                    $result['error'] = 'No existen Usuarios registrados';
                }
                break;

                // Verificar la existencia de un usuario por su nombre de usuario.
            case 'readExist':
                if ($Usuario->readExist($_POST['usuario'])) {
                    $result['status'] = 1;
                } else {
                    $result['status'] = 2;
                }
                break;

                // Leer un usuario específico.
            case 'readOne':
                if (!$Usuario->setId($_POST['idUsuario'])) {
                    $result['error'] = 'Usuario incorrecto';
                } elseif ($result['dataset'] = $Usuario->readOne()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Usuario inexistente';
                }
                break;

                // Actualizar un usuario.
            case 'updateRow':
                $_POST = Validator::validateForm($_POST);
                if (
                    !$Usuario->setId($_POST['idUsuario']) or
                    !$Usuario->setIdRol($_POST['rolUsuario']) or
                    !$Usuario->setNombre($_POST['nombreUsuario']) or
                    !$Usuario->setApellido($_POST['apellidoUsuario']) or
                    !$Usuario->setCorreo($_POST['correoUsuario']) or
                    !$Usuario->setCorreoNew($_POST['correoUsuarioNew']) or
                    !$Usuario->setEstado(isset($_POST['estadoUsuario']) ? 1 : 0)
                ) {
                    $result['error'] = $Usuario->getDataError();
                } elseif ($_POST['correoUsuarioNew'] != $_POST['correoUsuario'] && $Usuario->readExistMail($_POST['correoUsuario'])) {
                    $result['error'] = 'El correo electrónico ya está en uso';
                } elseif ($Usuario->updateRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Usuario modificado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el Usuario';
                }
                break;

                // Eliminar un usuario.
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

                // Obtener información del usuario en sesión.
            case 'getUser':
                unset($_SESSION['pasw']);
                if (isset($_SESSION['usuarion'])) {
                    $result['status'] = 1;
                    $result['username'] = $_SESSION['usuarion'];
                    $result['ultimo_cambio'] = $_SESSION['ultimo_cambio'];
                    $result['idrol'] = $_SESSION['idRol'];
                    $result['productos_opc'] = $_SESSION['productos_opc'];
                    $result['pedidos_opc'] = $_SESSION['pedidos_opc'];
                    $result['tipo_items_opc'] = $_SESSION['tipo_items_opc'];
                    $result['items_opc'] = $_SESSION['items_opc'];
                    $result['clientes_opc'] = $_SESSION['clientes_opc'];
                    $result['usuarios_opc'] = $_SESSION['usuarios_opc'];
                    $result['roles_opc'] = $_SESSION['roles_opc'];
                } else {
                    //$result['dataset'] = 2;
                    $result['error'] = 'Alias de Usuario indefinido';
                }
                break;
                // Cerrar sesión.
            case 'logOut':
                if (session_destroy()) {
                    $result['status'] = 1;
                    $result['message'] = 'Sesión eliminada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al cerrar la sesión';
                }
                break;

                // Leer perfil de usuario.
            case 'readProfile':
                if ($result['dataset'] = $Usuario->readProfile()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Ocurrió un problema al leer el perfil';
                }
                break;

                // Editar perfil de usuario.
            case 'editProfile':
                $_POST = Validator::validateForm($_POST);

                if (
                    !$Usuario->setNombre($_POST['nombreAdministrador']) or
                    !$Usuario->setApellido($_POST['apellidoAdministrador']) or
                    !$Usuario->setCorreo($_POST['correoAdministrador']) or
                    !$Usuario->setAlias($_POST['aliasAdministrador'])
                ) {
                    $result['error'] = $Usuario->getDataError();
                } elseif ($_SESSION['usuarion'] != $_POST['aliasAdministrador'] && $Usuario->readExist($_POST['aliasAdministrador'])) {
                    $result['error'] = 'El nombre de usuario ya está en uso';
                } elseif ($_SESSION['correo'] != $_POST['correoAdministrador'] && $Usuario->readExistMail($_POST['correoAdministrador'])) {
                    $result['error'] = 'El correo electrónico ya está en uso';
                } elseif ($Usuario->editProfile()) {
                    $result['status'] = 1;
                    $result['message'] = 'Perfil modificado correctamente';
                    $_SESSION['alias'] = $_POST['aliasAdministrador'];
                } else {
                    $result['error'] = 'Ocurrió un problema al modificar el perfil';
                }
                break;

                // Cambiar contraseña de usuario.
            case 'changePassword':
                $_POST = Validator::validateForm($_POST);
                if (!$Usuario->setId($_SESSION['idUsuario'])) {
                    $result['error'] = 'Acción no disponible';
                } elseif (!$Usuario->checkPassword($_POST['claveActual'])) {
                    $result['error'] = 'Contraseña actual incorrecta';
                } elseif ($_POST['claveActual'] == $_POST['claveNueva']) {
                    $result['error'] = 'La clave nueva no puede ser igual a la actual';
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
            case 'historialUsuarios':
                if (
                    !$Usuario->setId($_POST['limit'])
                ) {
                    $result['error'] = $Usuario->getDataError();
                } elseif ($result['dataset'] = $Usuario->historialUsuarios()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No hay datos disponibles';
                }
                break;
            case 'topRoles':
                if (
                    !$Usuario->setId($_POST['limit'])
                ) {
                    $result['error'] = $Usuario->getDataError();
                } elseif ($result['dataset'] = $Usuario->topRoles()) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'No hay datos disponibles';
                }
                break;
            case 'twoFAMetod':
                if (!$Usuario->setEstado(isset($_POST['twoFA']) ? 1 : 0)) {
                    $result['error'] = $Usuario->getDataError();
                } elseif ($Usuario->twoFA()) {
                    $result['status'] = 1;
                    $result['message'] = 'Cambio de autenticación';
                } else {
                    $result['error'] = 'Ocurrió un problema al actualizar';
                }
                break;

                // Acción no disponible dentro de la sesión.
            default:
                $result['error'] = 'Acción no disponible dentro de la sesión';
        }
    } else {
        // Se compara la acción a realizar cuando el Usuario no ha iniciado sesión.
        switch ($_GET['action']) {
                // Iniciar sesión de usuario.
            case 'logIn':
                $_POST = Validator::validateForm($_POST);
                // Llama a la función checkUser y captura la respuesta detallada
                $loginResult = $Usuario->checkUser($_POST['usuariol'], $_POST['clavel']);
                if ($loginResult['status']) {
                    // Verificar la última vez que se cambió la clave
                    $ultima_clave = new DateTime($_SESSION['ultimo_cambio']);
                    $fecha_actual = new DateTime();
                    $interval = $fecha_actual->diff($ultima_clave);
                    if ($interval->days > 90) {
                        // Si han pasado más de 90 días, solicitar cambio de clave
                        unset($_SESSION['idUsuario']);
                        $result['dataset'] = 4;
                        $result['message'] = 'Debe cambiar su contraseña cada 90 días.';
                    } else {
                        if ($_SESSION['2fa']) {
                            unset($_SESSION['idUsuario']);
                            $result['dataset'] = 5; // Por ejemplo, para indicar que se requiere 2FA
                            $result['message'] = 'Codigo enviado a su correo';
                        } else {
                            // Inicio de sesión exitoso sin 2FA
                            $result['status'] = 1;
                            $result['dataset'] = 1;
                            $result['message'] = $loginResult['message'];
                        }
                    }
                } else {
                    // Verificar si hay un error de bloqueo de cuenta o intentos fallidos
                    if (isset($loginResult['intentos'])) {
                        if ($loginResult['intentos'] >= 3) {
                            $result['dataset'] = 3;
                            $result['message'] = 'Cuenta suspendida por 24 horas debido a múltiples intentos fallidos.';
                        } else {
                            $result['dataset'] = 2;
                            $result['message'] = 'Credenciales incorrectas. Intento ' . $loginResult['intentos'] . ' de 3.';
                        }
                    } else {
                        $result['dataset'] = 2;
                        $result['message'] = 'Credenciales incorrectas';
                    }
                }
                break;
            case 'get2FA':
                if (isset($_SESSION['2fa'])) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Accion no habilitada';
                }
                break;
            case 'getChange':
                if (isset($_SESSION['idChange'])) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Accion no habilitada';
                }
            case 'getRecup':
                if (isset($_SESSION['usuarioRecup'])) {
                    $result['status'] = 1;
                } else {
                    $result['error'] = 'Accion no habilitada';
                }
                break;
            case 'newPassword':
                if (!$Usuario->setId($_SESSION['idChange'])) {
                    $result['error'] = 'Acción no disponible';
                } elseif ($_SESSION['pasw'] == $_POST['claveNueva']) {
                    $result['error'] = 'La clave nueva no puede ser igual a la actual';
                } elseif ($_POST['claveNueva'] != $_POST['confirmarClave']) {
                    $result['error'] = 'Contraseñas diferentes';
                } elseif (!$Usuario->setClave($_POST['claveNueva'])) {
                    $result['error'] = $Usuario->getDataError();
                } elseif ($Usuario->changePassword()) {
                    $result['status'] = 1;
                    $result['message'] = 'Contraseña modificada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al cambiar la contraseña';
                }
                break;
                // Leer todos los usuarios.
            case 'readUsers':
                if ($Usuario->readAll()) {
                    $result['status'] = 1;
                    //$result['message'] = 'Debe autenticarse para ingresar';
                } else {
                    $result['error'] = 'Debe crear un Usuario para comenzar';
                }
                break;
            case 'verifUs':
                if (!$Usuario->setUsuario($_POST['usuario'])) {
                    $result['error'] = $Usuario->getDataError();
                } elseif ($result['dataset'] = $Usuario->verifUs()) {
                    $result['status'] = 1;
                    $_SESSION['usuarioRecup'] = $result['dataset']['id_usuario'];
                } else {
                    $result['error'] = 'Usuario inexistente';
                }
                break;
            case 'verif2FA':
                if (!$Usuario->setUsuario($_POST['usuario'])) {
                    $result['error'] = $Usuario->getDataError();
                } elseif ($result['dataset'] = $Usuario->verifUs()) {
                    $result['status'] = 1;
                    $_SESSION['usuario2FA'] = $result['dataset']['id_usuario'];
                } else {
                    $result['error'] = 'Usuario inexistente';
                }
                break;
                case 'verifPin2FA':
                    if (
                        !$Usuario->setpinRecu($_POST['pinRecu']) or
                        !$Usuario->setId($_SESSION['usuario2FA'])
                    ) {
                        $result['error'] = $Usuario->getDataError();
                    } elseif ($result['dataset'] = $Usuario->verifPin()) {
                        $result['status'] = 1;
                        //$_SESSION['clienteRecup'] = $result['dataset']['id_cliente'];
                    } else {
                        $result['error'] = 'PIN incorrecto, revisa el corre electronico';
                    }
                    break;
            case 'verifPin':
                if (
                    !$Usuario->setpinRecu($_POST['pinRecu']) or
                    !$Usuario->setId($_SESSION['usuarioRecup'])
                ) {
                    $result['error'] = $Usuario->getDataError();
                } elseif ($result['dataset'] = $Usuario->verifPin()) {
                    $result['status'] = 1;
                    //$_SESSION['clienteRecup'] = $result['dataset']['id_cliente'];
                } else {
                    $result['error'] = 'PIN incorrecto, revisa el corre electronico';
                }
                break;
                // Cambiar contraseña de usuario.
            case 'changePasswordRecup':
                if (!$Usuario->setId($_SESSION['usuarioRecup'])) {
                    $result['error'] = 'Acción no disponible';
                } elseif ($_POST['claveNueva'] != $_POST['confirmarClave']) {
                    $result['error'] = 'Contraseñas diferentes';
                } elseif (!$Usuario->setClave($_POST['claveNueva'])) {
                    $result['error'] = $Usuario->getDataError();
                } elseif ($Usuario->changePasswordRecup()) {
                    $result['status'] = 1;
                    $result['message'] = 'Contraseña modificada correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al cambiar la contraseña';
                }
                break;
                // Registrar un nuevo usuario.
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
                } elseif ($Usuario->readAll()) {
                    $result['error'] = 'Ya hay un usuario creado';
                } elseif ($_POST['clave'] != $_POST['confirmarClave']) {
                    $result['error'] = 'Contraseñas diferentes';
                } elseif ($Usuario->createRow()) {
                    $result['status'] = 1;
                    $result['message'] = 'Usuario registrado correctamente';
                } else {
                    $result['error'] = 'Ocurrió un problema al registrar el Usuario';
                }
                break;
                // Acción no disponible fuera de la sesión.
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
