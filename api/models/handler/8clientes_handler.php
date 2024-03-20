<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
 *  Clase para manejar el comportamiento de los datos de la tabla cliente.
 */
class ClienteHandler
{
    /*
     *  Declaración de atributos para el manejo de datos.
     */
    protected $id = null;
    protected $nombre = null;
    protected $apellido = null;
    protected $email = null;
    protected $direccion = null;
    protected $usuario = null;
    protected $alias = null;
    protected $clave = null;
    protected $estado = null;

    /*
     *  Métodos para gestionar la cuenta del cliente.
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
        $sql = 'SELECT id_cliente , usuario_cliente, clave_cliente
                FROM prc_clientes
                WHERE  usuario_cliente = ?';
        //echo($username);
        $params = array($username);
        $data = Database::getRow($sql, $params);
        //echo $data['clave'];
        if (password_verify($password, $data['clave_cliente'])) {
            //echo ($_SESSION['usuario']).' 1';
            return true;
        } else {
            return false;
        }
    }

    public function checkPassword($password)
    {
        $sql = 'SELECT clave_cliente
                FROM prc_clientes
                WHERE id_cliente = ?';
        $params = array($_SESSION['idCliente']);
        $data = Database::getRow($sql, $params);
        // Se verifica si la contraseña coincide con el hash almacenado en la base de datos.
        if (password_verify($password, $data['clave_cliente'])) {
            return true;
        } else {
            return false;
        }
    }

    public function changePassword()
    {
        $sql = 'UPDATE prc_clientes
                SET clave_cliente = ?
                WHERE id_cliente = ?';
        $params = array($this->clave, $_SESSION['idCliente']);
        return Database::executeRow($sql, $params);
    }

    public function readProfile()
    {
        $sql = 'SELECT id_cliente, nombre_cliente, apellido_cliente, email_cliente, usuario_cliente,direccion_cliente
                FROM prc_clientes
                WHERE id_cliente = ?';
        $params = array($_SESSION['idCliente']);
        return Database::getRow($sql, $params);
    }

    public function editProfile()
    {
        $sql = 'UPDATE cliente
                SET nombre_cliente = ?, apellido_cliente = ?, email_cliente = ?, alias_cliente = ?
                WHERE id_cliente = ?';
        $params = array($this->nombre, $this->apellido, $this->email, $this->alias, $_SESSION['idcliente']);
        return Database::executeRow($sql, $params);
    }

    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */
    public function searchRows()
    {
        $value = '%' . Validator::getSearchValue() . '%';
        $sql = 'SELECT id_cliente,id_rol, nombre_cliente, apellido_cliente, email_cliente, alias_cliente
                FROM cliente
                WHERE apellido_cliente LIKE ? OR nombre_cliente LIKE ?
                ORDER BY apellido_cliente';
        $params = array($value, $value);
        return Database::getRows($sql, $params);
    }

    public function createRow()
    {
        //echo $this->clave.' ';
        $sql = 'insert into prc_clientes(usuario_cliente,clave_cliente,nombre_cliente,
        apellido_cliente,email_cliente,pin_cliente,estado_cliente,direccion_cliente) 
        values(?,?,?,?,?,?,true,?)';
        $params = array($this->alias, $this->clave, $this->nombre,
         $this->apellido, $this->email, $this->generarPin(),$this->direccion);
         
        return Database::executeRow($sql, $params);
    }

    public function readAll()
    {
        $sql = 'SELECT id_cliente,usuario_cliente, clave_cliente, 
         nombre_cliente, apellido_cliente ,email_cliente, estado_cliente,direccion_cliente
                from prc_clientes 
                ORDER BY apellido_cliente';
        return Database::getRows($sql);
    }
    public function readAllActive()
    {
        $sql = 'SELECT id_cliente,usuario_cliente, clave_cliente, 
         nombre_cliente, apellido_cliente ,email_cliente, estado_cliente,direccion_cliente
                from prc_clientes where estado_cliente=true
                ORDER BY apellido_cliente';
        return Database::getRows($sql);
    }

    public function readOne()
    {
        $sql = 'SELECT id_cliente,usuario_cliente,clave_cliente,nombre_cliente,
                apellido_cliente,email_cliente,estado_cliente,direccion_cliente
                from prc_clientes
                WHERE id_cliente = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }
    public function readExist($username)
    {
        $sql = 'SELECT usuario_cliente, clave_cliente, nombre_cliente, apellido_cliente, email_cliente, estado_cliente
        FROM prc_clientes
        WHERE usuario_cliente = ?';
        $params = array($username);
        $data = Database::getRow($sql, $params);

        if (empty($data['usuario_cliente'])) {
            return false;
        } else {
            return true;
        }
    }


    public function updateRow()
    {
        $sql = 'UPDATE prc_clientes 
                SET nombre_cliente = ?, apellido_cliente = ?, email_cliente = ?
                WHERE id_cliente = ?';
        $params = array($this->nombre, $this->apellido, $this->email, $this->id);
        return Database::executeRow($sql, $params);
    }

    public function deleteRow()
    {
        $sql = 'DELETE FROM prc_clientes
                WHERE id_cliente = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
