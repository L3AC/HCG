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
    protected $telefono = null;
    protected $email = null;
    protected $direccion = null;
    protected $usuario = null;
    protected $clave = null;
    protected $estado = null;
    protected $search = null;
    protected $newemail = null;
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

    // Método para verificar el usuario y contraseña.
    public function checkUser($usuario, $password)
    {
        $sql = 'SELECT id_cliente, usuario_cliente, clave_cliente, estado_cliente,correo_cliente
                FROM tb_clientes
                WHERE usuario_cliente = ?';
        $params = array($usuario);
        $data = Database::getRow($sql, $params);
        if ($data && password_verify($password, $data['clave_cliente'])) {
            $this->id = $data['id_cliente'];
            $this->usuario = $data['usuario_cliente'];
            $this->estado = $data['estado_cliente'];
            $this->email = $data['correo_cliente'];
            return true;
        } else {
            return false;
        }
    }

    // Método para verificar el estado del cliente.
    public function checkStatus()
    {
        if ($this->estado) {
            $_SESSION['idCliente'] = $this->id;
            $_SESSION['usuarioc'] = $this->usuario;
            $_SESSION['correo'] = $this->email;
            return true;
        } else {
            return false;
        }
    }

    // Método para cambiar la contraseña del cliente.
    public function changePassword()
    {
        $sql = 'UPDATE tb_clientes
                SET clave_cliente = ?
                WHERE id_cliente = ?';
        $params = array($this->clave, $_SESSION['idCliente']);
        return Database::executeRow($sql, $params);
    }

    // Método para leer el perfil del cliente.
    public function readProfile()
    {
        $sql = 'SELECT *
                FROM tb_clientes
                WHERE id_cliente = ?';
        $params = array($_SESSION['idCliente']);
        return Database::getRow($sql, $params);
    }

    // Método para editar el perfil del cliente.
    public function editProfile()
    {
        $sql = 'UPDATE tb_clientes
                SET nombre_cliente = ?, apellido_cliente = ?, correo_cliente = ?, usuario_cliente = ?,telefono_cliente = ?
                WHERE id_cliente = ?';
        $params = array($this->nombre, $this->apellido, $this->email, $this->usuario, $this->telefono, $_SESSION['idCliente']);
        return Database::executeRow($sql, $params);
    }
    /*
     *  Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
     */

    // Método para buscar filas que coincidan con el término de búsqueda.
    public function searchRows()
    {
        $this->search = $this->search === '' ? '%%' : '%' . $this->search . '%';
        $sql = 'SELECT id_cliente, nombre_cliente, apellido_cliente, 
        correo_cliente, usuario_cliente,estado_cliente,telefono_cliente
                FROM tb_clientes
                WHERE apellido_cliente LIKE ? OR nombre_cliente LIKE ? 
                OR correo_cliente like ? OR telefono_cliente LIKE ?
                ORDER BY apellido_cliente';
        $params = array($this->search, $this->search, $this->search, $this->search);
        return Database::getRows($sql, $params);
    }

    // Método para crear una nueva fila en la tabla clientes.
    public function createRow()
    {
        //echo $this->clave.' ';
        $sql = 'insert into tb_clientes(id_cliente,usuario_cliente,clave_cliente,nombre_cliente,
        apellido_cliente,correo_cliente,pin_cliente,estado_cliente,telefono_cliente) 
        values((SELECT get_next_id("tb_clientes")),?,?,?,?,?,?,true,?)';
        $params = array(
            $this->usuario, $this->clave, $this->nombre,
            $this->apellido, $this->email, $this->generarPin(), $this->telefono
        );

        return Database::executeRow($sql, $params);
    }

    // Método para leer todos los clientes.
    public function readAll()
    {
        $sql = 'SELECT id_cliente,nombre_cliente,apellido_cliente,
                telefono_cliente,correo_cliente,estado_cliente
                FROM tb_clientes; 
                ORDER BY apellido_cliente';
        return Database::getRows($sql);
    }

    // Método para leer todos los clientes activos.
    public function readAllActive()
    {
        $sql = 'SELECT id_cliente,usuario_cliente, clave_cliente, 
         nombre_cliente, apellido_cliente ,email_cliente, estado_cliente,direccion_cliente
                from prc_clientes where estado_cliente=true
                ORDER BY apellido_cliente';
        return Database::getRows($sql);
    }

    // Método para leer un solo cliente por su ID.
    public function readOne()
    {
        $sql = 'SELECT * from tb_clientes 
                WHERE id_cliente = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }
    
    public function verifUs()
    {
        $sql = 'SELECT *
        from tb_clientes 
        WHERE usuario_cliente = ?';
        $params = array($this->usuario);
        return Database::getRow($sql, $params);
    }
    // Método para verificar si existe un usuario con un nombre específico.
    public function readExist($username)
    {
        $sql = 'SELECT usuario_cliente
        FROM tb_clientes
        WHERE usuario_cliente = ?';
        $params = array($username);
        $data = Database::getRow($sql, $params);

        if (empty($data['usuario_cliente'])) {
            return false;
        } else {
            return true;
        }
    }

    // Método para verificar si existe un cliente con un correo específico.
    public function readExistMail($username)
    {
        $sql = 'SELECT correo_cliente
        FROM tb_clientes
        WHERE correo_cliente = ?';
        $params = array($username);
        $data = Database::getRow($sql, $params);

        if (empty($data['correo_cliente'])) {
            return false;
        } else {
            return true;
        }
    }

    // Método para actualizar los datos de un cliente.
    public function updateRow()
    {
        $sql = 'UPDATE tb_clientes 
                SET nombre_cliente = ?, apellido_cliente = ?, 
                correo_cliente = ?,telefono_cliente = ?,estado_cliente = ?
                WHERE id_cliente = ?';
        $params = array($this->nombre, $this->apellido, $this->email,
        $this->telefono,$this->estado, $this->id);
        return Database::executeRow($sql, $params);
    }

    // Método para eliminar un cliente.
    public function deleteRow()
    {
        $sql = 'DELETE FROM tb_clientes
                WHERE id_cliente = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }
}
