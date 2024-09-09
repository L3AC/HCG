
<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla administrador.
 */
class UsuarioHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $search = null;
    protected $idRol = null;
    protected $nombre = null;
    protected $apellido = null;
    protected $correo = null;
    protected $new_correo = null;
    protected $usuario = null;
    protected $alias = null;
    protected $clave = null;
    protected $estado = null;
    protected $pinRecu = null;

    /*
     *  Métodos para gestionar la cuenta del administrador.
     */
    /*GENERAR PIN*/
    public function generarPin()
    {
        $pinLength = 6;
        $pin = '';

        for ($i = 0; $i < $pinLength; $i++) {
            $pin .= mt_rand(0, 9);
        }

        return $pin;
    }

    // Método para verificar las credenciales del usuario al iniciar sesión.
    public function checkUser($username, $password)
    {
        $sql = 'SELECT id_usuario, id_rol, alias_usuario, clave_usuario, email_usuario, 
                estado_rol, productos_opc, pedidos_opc, tipo_items_opc, items_opc, 
                clientes_opc, usuarios_opc, roles_opc, intentos_usuario, fecha_reactivacion, ultimo_intento,ultimo_cambio_clave
                FROM tb_usuarios
                INNER JOIN tb_roles USING (id_rol)
                WHERE alias_usuario = ? AND estado_rol = true AND estado_usuario= true';
        
        $params = array($username);
        $data = Database::getRow($sql, $params);
    
        if ($data) {
            $intentos = $data['intentos_usuario'];
            $ultimo_intento = $data['ultimo_intento'];
            $fecha_reactivacion = $data['fecha_reactivacion'];
    
            // Comprobar si el usuario está bloqueado
            if ($intentos >= 3 && $fecha_reactivacion && strtotime($fecha_reactivacion) > time()) {
                return [
                    'status' => false,
                    'message' => "Cuenta bloqueada por 24 horas debido a múltiples intentos fallidos.",
                    'intentos' => $intentos
                ];
            }
    
            // Verificar si han pasado más de 10 minutos desde el último intento fallido
            if ($ultimo_intento) {
                $now = new DateTime();
                $lastAttempt = new DateTime($ultimo_intento);
                $interval = $now->diff($lastAttempt);
    
                if ($interval->i >= 10) {
                    // Reiniciar contador de intentos si han pasado más de 10 minutos
                    $intentos = 0;
                    $this->reiniciarIntentos($data['id_usuario']);
                }
            }
    
            if (password_verify($password, $data['clave_usuario'])) {
                // Restablecer el contador de intentos en caso de inicio de sesión exitoso
                $this->reiniciarIntentos($data['id_usuario']);
    
                // Establecer las variables de sesión
                $_SESSION['idUsuario'] = $data['id_usuario'];
                $_SESSION['idChange'] = $data['id_usuario'];
                $_SESSION['pasw'] = $password;
                $_SESSION['ultimo_cambio'] = $data['ultimo_cambio_clave'];
                $_SESSION['usuarion'] = $data['alias_usuario'];
                $_SESSION['correo'] = $data['email_usuario'];
                $_SESSION['idRol'] = $data['id_rol'];
                $_SESSION['productos_opc'] = $data['productos_opc'];
                $_SESSION['pedidos_opc'] = $data['pedidos_opc'];
                $_SESSION['tipo_items_opc'] = $data['tipo_items_opc'];
                $_SESSION['items_opc'] = $data['items_opc'];
                $_SESSION['clientes_opc'] = $data['clientes_opc'];
                $_SESSION['usuarios_opc'] = $data['usuarios_opc'];
                $_SESSION['roles_opc'] = $data['roles_opc'];
    
                return ['status' => true, 'message' => "Credenciales correctas"];
            } else {
                // Incrementar el contador de intentos fallidos
                $this->incrementarIntentos($data['id_usuario']);
                
                // Verificar si ahora el usuario tiene 3 intentos fallidos para bloquear la cuenta
                if ($intentos + 1 >= 3) {
                    $this->blockUser($data['id_usuario']);
                    return [
                        'status' => false,
                        'message' => "Cuenta bloqueada por 24 horas debido a múltiples intentos fallidos.",
                        'intentos' => $intentos + 1
                    ];
                } else {
                    return [
                        'status' => false,
                        'message' => "Credenciales incorrectas sa. Intento " . ($intentos + 1) ." de 3. Se reinician cada 10 minutos ",
                        'intentos' => $intentos + 1,
                    ];
                }
            }
        } else {
            return ['status' => false, 'message' => "Usuario no encontrado", 'intentos' => 0];
        }
    }
    
    // Función para reiniciar el contador de intentos
    private function reiniciarIntentos($id_usuario)
    {
        $sql = 'UPDATE tb_usuarios SET intentos_usuario = 0, ultimo_intento = NULL, fecha_reactivacion = NULL WHERE id_usuario = ?';
        $params = array($id_usuario);
        return Database::executeRow($sql, $params);
    }

    //Funcion para verificar si el usuaro existe
    public function verifUs()
    {
        $sql = 'SELECT *
        from  tb_usuarios
        WHERE alias_usuario = ?';
        $params = array($this->usuario);
        /*$data*/  return Database::getRow($sql, $params);
        /*if ($data) {
            $_SESSION['idRec'] = $data['id_usuario'];
            return true;
        }else{
            return false;
        }*/
    }

    public function verifPin()
    {
        $sql = 'SELECT * from tb_usuarios
        WHERE pin_usuario = ? AND id_usuario = ?';
        $params = array($this->pinRecu, $this->id);
        return Database::getRow($sql, $params);
    }
    
    // Función para incrementar el contador de intentos
    private function incrementarIntentos($id_usuario)
    {
        $sql = 'UPDATE tb_usuarios SET intentos_usuario = intentos_usuario + 1, ultimo_intento = CURRENT_TIMESTAMP WHERE id_usuario = ?';
        $params = array($id_usuario);
        return Database::executeRow($sql, $params);
    }
    
    // Función para bloquear al usuario
    private function blockUser($id_usuario)
    {
        // Bloquear la cuenta por 24 horas
        $sql = 'UPDATE tb_usuarios SET fecha_reactivacion = DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 DAY), WHERE id_usuario = ?';
        $params = array($id_usuario);
        return Database::executeRow($sql, $params);
    }
    


    // Método para verificar si la contraseña actual del usuario es correcta.
    public function checkPassword($password)
    {
        $sql = 'SELECT clave_usuario
                FROM tb_usuarios
                WHERE id_usuario = ?';
        $params = array($_SESSION['idUsuario']);
        $data = Database::getRow($sql, $params);
        // Se verifica si la contraseña coincide con el hash almacenado en la base de datos.
        if (password_verify($password, $data['clave_usuario'])) {
            return true;
        } else {
            return false;
        }
    }

    // Método para cambiar la contraseña del usuario.
    public function changePasswordRecup()
    {
        $sql = 'UPDATE tb_usuarios
                SET clave_usuario = ?, ultimo_cambio_clave = now(), pin_usuario = ?
                WHERE id_usuario = ?';
        $params = array($this->clave, $this->generarPin(), $this->id);
        return Database::executeRow($sql, $params);
    }

    // Método para cambiar la contraseña del usuario.
    public function changePassword()
    {
        $sql = 'UPDATE tb_usuarios
                SET clave_usuario = ?, ultimo_cambio_clave = now()
                WHERE id_usuario = ?';
        $params = array($this->clave, $this->id);
        return Database::executeRow($sql, $params);
    }

    // Método para leer el perfil del usuario actual.
    public function readProfile()
    {
        $sql = 'SELECT id_usuario, nombre_usuario, apellido_usuario, email_usuario, alias_usuario
                FROM tb_usuarios
                WHERE id_usuario = ?';
        $params = array($_SESSION['idUsuario']);
        return Database::getRow($sql, $params);
    }

    // Método para actualizar el perfil del usuario actual.
    public function editProfile()
    {
        $sql = 'UPDATE tb_usuarios
                SET nombre_usuario = ?, apellido_usuario = ?, email_usuario = ?, alias_usuario = ?
                WHERE id_usuario = ?';
        $params = array($this->nombre, $this->apellido, $this->correo, $this->alias, $_SESSION['idUsuario']);
        return Database::executeRow($sql, $params);
    }
    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */

    // Método para buscar usuarios en la tabla de usuarios.
    public function searchRows()
    {
        $this->search = $this->search === '' ? '%%' : '%' . $this->search . '%';
        $sql = 'SELECT id_usuario, nombre_usuario, apellido_usuario, 
        email_usuario, alias_usuario,estado_usuario
        FROM tb_usuarios
        WHERE id_usuario !=  (SELECT MIN(id_usuario) FROM tb_usuarios) 
        AND nombre_usuario like ? OR apellido_usuario like ? OR email_usuario like ? 
        OR alias_usuario like ? 
        AND id_rol!=?
        ORDER BY apellido_usuario';

        $params = array($this->search,$this->search,$this->search,$this->search,$_SESSION['idRol']);
        return Database::getRows($sql, $params);
    }

    // Método para llenar una tabla con usuarios basados en el rol proporcionado.
    public function fillTab($idrol)
    {
        $sql = 'SELECT id_usuario, nombre_usuario, apellido_usuario, email_usuario, alias_usuario,estado_usuario
        FROM tb_usuarios
        WHERE id_usuario != (SELECT MIN(id_usuario) FROM tb_usuarios)
        AND id_rol!=?
        ORDER BY apellido_usuario';

        $params = array($idrol);
        return Database::getRows($sql, $params);
    }

    // Método para crear un nuevo usuario en la tabla de usuarios.
    public function createRow()
    {
        //echo $this->clave.' ';
        $this->idRol = ($this->idRol === null) ? 1 : $this->idRol;
        $sql = '
        INSERT INTO tb_usuarios(id_usuario,id_rol,alias_usuario, clave_usuario,nombre_usuario, 
        apellido_usuario,email_usuario,pin_usuario,estado_usuario)
        VALUES((SELECT get_next_id("tb_usuarios")),?, ?, ?, ?, ?,?,?,true)';
        $params = array($this->idRol, $this->alias, $this->clave, $this->nombre, 
        $this->apellido, $this->correo, $this->generarPin());
        return Database::executeRow($sql, $params);
    }

    // Método para leer todos los usuarios de la tabla de usuarios.
    public function readAll()
    {
        $sql = 'SELECT id_usuario, nombre_usuario, apellido_usuario,
        email_usuario, alias_usuario,estado_usuario
        FROM tb_usuarios';
        return Database::getRows($sql);
    }

    // Método para leer todos los usuarios activos de la tabla de usuarios.
    public function readAllA()
    {
        $sql = 'SELECT id_usuario, nombre_usuario, apellido_usuario,
                email_usuario, alias_usuario,estado_usuario
                FROM tb_usuarios WHERE estado_usuario=true
                ORDER BY apellido_usuario';
        return Database::getRows($sql);
    }

    // Método para leer un usuario específico por su ID.
    public function readOne()
    {
        $sql = 'SELECT id_usuario,id_rol, nombre_usuario, apellido_usuario,
                email_usuario, alias_usuario,estado_usuario
                FROM tb_usuarios
                WHERE id_usuario = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    // Método para verificar la existencia de un alias de usuario específico.
    public function readExist($username)
    {
        $sql = 'SELECT alias_usuario
        FROM tb_usuarios
        WHERE alias_usuario= ?';
        $params = array($username);
        $data = Database::getRow($sql, $params);

        if (empty($data['alias_usuario'])) {
            return false;
        } else {
            return true;
        }
    }

    // Método para actualizar los datos de un usuario específico.
    public function updateRow()
    {
        $sql = 'UPDATE tb_usuarios
                SET nombre_usuario = ?, apellido_usuario= ?, email_usuario = ?,
                id_rol = ?,estado_usuario = ?
                WHERE id_usuario = ?';
        $params = array($this->nombre, $this->apellido, $this->new_correo,
        $this->idRol,$this->estado, $this->id);
        return Database::executeRow($sql, $params);
    }

    // Método para eliminar un usuario de la tabla de usuarios.
    public function deleteRow()
    {
        $sql = 'DELETE sec_usuarios
                WHERE id_usuario = ?';
        /*$sql = 'DELETE FROM sec_usuarios
                WHERE id_usuario = ?';*/
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    // Método para verificar la existencia de un correo electrónico específico.
    public function readExistMail($username)
    {
        $sql = 'SELECT email_usuario
        FROM tb_usuarios
        WHERE email_usuario= ?';
        $params = array($username);
        $data = Database::getRow($sql, $params);

        if (empty($data['email_usuario'])) {
            return false;
        } else {
            return true;
        }
    }
    public function historialUsuarios(){
        $sql="SELECT 
    DATE_FORMAT(fecha_cliente, '%Y-%m') AS mes,
    COUNT(*) AS usuarios_mensuales,
    CASE
        WHEN DATE_FORMAT(fecha_cliente, '%m') = '01' THEN 'Enero'
        WHEN DATE_FORMAT(fecha_cliente, '%m') = '02' THEN 'Febrero'
        WHEN DATE_FORMAT(fecha_cliente, '%m') = '03' THEN 'Marzo'
        WHEN DATE_FORMAT(fecha_cliente, '%m') = '04' THEN 'Abril'
        WHEN DATE_FORMAT(fecha_cliente, '%m') = '05' THEN 'Mayo'
        WHEN DATE_FORMAT(fecha_cliente, '%m') = '06' THEN 'Junio'
        WHEN DATE_FORMAT(fecha_cliente, '%m') = '07' THEN 'Julio'
        WHEN DATE_FORMAT(fecha_cliente, '%m') = '08' THEN 'Agosto'
        WHEN DATE_FORMAT(fecha_cliente, '%m') = '09' THEN 'Septiembre'
        WHEN DATE_FORMAT(fecha_cliente, '%m') = '10' THEN 'Octubre'
        WHEN DATE_FORMAT(fecha_cliente, '%m') = '11' THEN 'Noviembre'
        WHEN DATE_FORMAT(fecha_cliente, '%m') = '12' THEN 'Diciembre'
    END AS nombre_mes
    FROM 
    tb_clientes
    WHERE 
    estado_cliente = TRUE
    AND DATE_FORMAT(fecha_cliente, '%Y-%m') BETWEEN 
    DATE_FORMAT(DATE_SUB((SELECT MAX(fecha_cliente) FROM tb_clientes), INTERVAL ".$this->id." MONTH), '%Y-%m')
    AND DATE_FORMAT((SELECT MAX(fecha_cliente) FROM tb_clientes), '%Y-%m')
    GROUP BY 
    DATE_FORMAT(fecha_cliente, '%Y-%m')
    ORDER BY 
    mes ASC;";
        $params = array();
        return Database::getRows($sql, $params);
    }
    
    public function topRoles(){
        $sql="SELECT descripcion_rol,COUNT(id_usuario) AS cantidad_usuarios
        FROM tb_usuarios
        INNER JOIN tb_roles USING(id_rol)
        GROUP BY descripcion_rol
        ORDER BY cantidad_usuarios DESC
        LIMIT ".$this->id.";";
        $params = array();
        return Database::getRows($sql, $params);
    }
}
