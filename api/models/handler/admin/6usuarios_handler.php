<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla administrador.
 */
class AdministradorHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $idRol = null;
    protected $nombre = null;
    protected $apellido = null;
    protected $correo = null;
    protected $usuario = null;
    protected $alias = null;
    protected $clave = null;
    protected $estado = null;

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
    public function checkUser($username, $password)
    {
        $sql = 'SELECT id_usuario ,id_rol, alias_usuario, clave_usuario, 
        estado_rol, productos_opc,pedidos_opc, tipo_items_opc,items_opc,
        clientes_opc, usuarios_opc, roles_opc
        FROM tb_usuarios
        INNER JOIN tb_roles using(id_rol)
        WHERE  estado_usuario=true AND alias_usuario = ? AND estado_rol=true';
        //echo($username);
        $params = array($username);
        $data = Database::getRow($sql, $params);
        //echo $data['clave'];
        if (password_verify($password, $data['clave_usuario'])) {
            $_SESSION['idUsuario'] = $data['id_usuario'];
            $_SESSION['alias'] = $data['alias_usuario'];
            $_SESSION['idRol'] = $data['id_rol'];
            $_SESSION['productos_opc']       = $data['productos_opc'];
            $_SESSION['pedidos_opc']       = $data['pedidos_opc'];
            $_SESSION['tipo_items_opc'] = $data['tipo_items_opc'];
            $_SESSION['items_opc']      = $data['items_opc'];
            $_SESSION['clientes_opc']   = $data['clientes_opc'];
            $_SESSION['usuarios_opc']   =  $data['usuarios_opc'];
            $_SESSION['roles_opc']      =$data['roles_opc'];

            //echo ($_SESSION['usuario']).' 1';
            return true;
        } else {
            return false;
        }
    }

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

    public function changePassword()
    {
        $sql = 'UPDATE sec_usuarios
                SET clave_usuario = ?
                WHERE id_usuario = ?';
        $params = array($this->clave, $_SESSION['idUsuario']);
        return Database::executeRow($sql, $params);
    }

    public function readProfile()
    {
        $sql = 'SELECT id_usuario, nombre_usuario, apellido_usuario, email_usuario, alias_usuario
                FROM tb_usuarios
                WHERE id_usuario = ?';
        $params = array($_SESSION['idUsuario']);
        return Database::getRow($sql, $params);
    }

    public function editProfile()
    {
        $sql = 'UPDATE sec_usuarios
                SET nombre_usuario = ?, apellido_usuario = ?, email_usuario = ?, usuario_usuario = ?
                WHERE id_usuario = ?';
        $params = array($this->nombre, $this->apellido, $this->correo, $this->alias, $_SESSION['idUsuario']);
        return Database::executeRow($sql, $params);
    }
    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    public function searchRows($idrol, $value/*,$value2,$value3*/)
    {
        $value = ($value === '') ? '' : 'AND nombre_usuario like %' . $value . '%';
        /*$value2 = ($value2 === '') ? '%%' : '%' . $value2 . '%';
        $value3 = ($value3 === '') ? '%%' : '%' . $value3 . '%';*/

        $sql = 'SELECT id_usuario, nombre_usuario, apellido_usuario, email_usuario, usuario_usuario
        FROM sec_usuarios
        WHERE id_usuario != idmin("sec_usuarios") 
        AND id_rol!=?
        ORDER BY apellido_usuario';

        $params = array($idrol);
        return Database::getRows($sql, $params);
    }
    public function fillTab($idrol)
    {
        $sql = 'SELECT id_usuario, nombre_usuario, apellido_usuario, email_usuario, usuario_usuario
        FROM sec_usuarios
        WHERE id_usuario != idmin("sec_usuarios") 
        AND id_rol!=?
        ORDER BY apellido_usuario';

        $params = array($idrol);
        return Database::getRows($sql, $params);
    }

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

    public function readAll()
    {
        $sql = 'SELECT id_usuario, nombre_usuario, apellido_usuario,
        email_usuario, alias_usuario
        FROM tb_usuarios';
        return Database::getRows($sql);
    }
    public function readAllA()
    {
        $sql = 'SELECT id_usuario, nombre_usuario, apellido_usuario, email_usuario, usuario_usuario
                FROM sec_usuarios WHERE estado_usuario=true
                ORDER BY apellido_usuario';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql = 'SELECT id_rol,id_usuario, nombre_usuario, apellido_usuario, email_usuario, usuario_usuario
                FROM sec_usuarios
                WHERE id_usuario = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }
    public function readExist($username)
    {
        $sql = 'SELECT usuario_usuario
        FROM sec_usuarios
        WHERE usuario_usuario= ?';
        $params = array($username);
        $data = Database::getRow($sql, $params);

        if (empty($data['usuario_usuario'])) {
            return false;
        } else {
            return true;
        }
    }

    public function updateRow()
    {
        $sql = 'UPDATE sec_usuarios
                SET nombre_usuario = ?, apellido_usuario= ?, email_usuario = ?
                WHERE id_usuario = ?';
        $params = array($this->nombre, $this->apellido, $this->correo, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'DELETE sec_usuarios
                WHERE id_usuario = ?';
        /*$sql = 'DELETE FROM sec_usuarios
                WHERE id_usuario = ?';*/
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}