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
    protected $pin = null;
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
    public function checkPassword($password)
    {
        $sql = 'SELECT clave_cliente
                FROM tb_clientes
                WHERE id_cliente = ?';

        $params = array($this->id);
        $data = Database::getRow($sql, $params);
        // Se verifica si la contraseña coincide con el hash almacenado en la base de datos.
        if ($data && password_verify($password, $data['clave_cliente'])) {
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
        $params = array($this->clave, $this->id);
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
            $this->usuario,
            $this->clave,
            $this->nombre,
            $this->apellido,
            $this->email,
            $this->generarPin(),
            $this->telefono
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
    public function verifPin()
    {
        $sql = 'SELECT * from tb_clientes
        WHERE pin_cliente = ? AND id_cliente = ?';
        $params = array($this->pin, $_SESSION['clienteRecup']);
        return Database::getRow($sql, $params);
    }
    public function updatePin()
    {
        $sql = 'update tb_clientes set pin_cliente=?
         where id_cliente=?;';
        $params = array($this->generarPin(), $_SESSION['clienteRecup']);
        return Database::executeRow($sql, $params);
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
        $params = array(
            $this->nombre,
            $this->apellido,
            $this->email,
            $this->telefono,
            $this->estado,
            $this->id
        );
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
    public function topClientes()
    {
        $this->id = $this->id === null ? 20 : $this->id;
        $sql = 'SELECT id_cliente,CONCAT(nombre_cliente," ", apellido_cliente) AS cliente, correo_cliente,
        SUM(cantidad_pedido) AS total_productos_comprados
        FROM tb_clientes
        JOIN tb_pedidos USING(id_cliente)
        JOIN tb_detalle_pedidos USING(id_pedido)
        WHERE estado_pedido = "Finalizado"
        GROUP BY id_cliente, nombre_cliente, apellido_cliente, correo_cliente
        ORDER BY total_productos_comprados DESC
        LIMIT  ' . $this->id . ';';
        $params = array();
        return Database::getRows($sql, $params);
    }
    public function prediccionClientes()
    {
        $sql = "WITH clientes_mes AS (
    SELECT DATE_FORMAT(fecha_cliente, '%Y-%m') AS mes,
           COUNT(*) AS clientes_mensuales,
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
           END AS nombre_mes,
           ROW_NUMBER() OVER (ORDER BY DATE_FORMAT(fecha_cliente, '%Y-%m')) AS mes_indice
            FROM tb_clientes
            WHERE estado_cliente = TRUE
            GROUP BY DATE_FORMAT(fecha_cliente, '%Y-%m')
            ORDER BY DATE_FORMAT(fecha_cliente, '%Y-%m') DESC
            LIMIT " . $this->id . "
        ),
        coeficientes AS (
            SELECT COUNT(*) AS n,
                SUM(mes_indice) AS sum_x,
                SUM(clientes_mensuales) AS sum_y,
                SUM(mes_indice * clientes_mensuales) AS sum_xy,
                SUM(mes_indice * mes_indice) AS sum_xx
            FROM clientes_mes
        ),
        calculos AS (
            SELECT
                (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x) AS slope,
                (sum_y - ((n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x)) * sum_x) / n AS intercept
            FROM coeficientes
        ),
        prediccion AS (
            SELECT
                ROUND(c.slope * (MAX(cmes.mes_indice) + 1) + c.intercept, 2) AS prediccion_siguiente_mes,
                CASE
                    WHEN DATE_FORMAT(ADDDATE(MAX(fecha_cliente), INTERVAL 1 MONTH), '%m') = '01' THEN 'Enero'
                    WHEN DATE_FORMAT(ADDDATE(MAX(fecha_cliente), INTERVAL 1 MONTH), '%m') = '02' THEN 'Febrero'
                    WHEN DATE_FORMAT(ADDDATE(MAX(fecha_cliente), INTERVAL 1 MONTH), '%m') = '03' THEN 'Marzo'
                    WHEN DATE_FORMAT(ADDDATE(MAX(fecha_cliente), INTERVAL 1 MONTH), '%m') = '04' THEN 'Abril'
                    WHEN DATE_FORMAT(ADDDATE(MAX(fecha_cliente), INTERVAL 1 MONTH), '%m') = '05' THEN 'Mayo'
                    WHEN DATE_FORMAT(ADDDATE(MAX(fecha_cliente), INTERVAL 1 MONTH), '%m') = '06' THEN 'Junio'
                    WHEN DATE_FORMAT(ADDDATE(MAX(fecha_cliente), INTERVAL 1 MONTH), '%m') = '07' THEN 'Julio'
                    WHEN DATE_FORMAT(ADDDATE(MAX(fecha_cliente), INTERVAL 1 MONTH), '%m') = '08' THEN 'Agosto'
                    WHEN DATE_FORMAT(ADDDATE(MAX(fecha_cliente), INTERVAL 1 MONTH), '%m') = '09' THEN 'Septiembre'
                    WHEN DATE_FORMAT(ADDDATE(MAX(fecha_cliente), INTERVAL 1 MONTH), '%m') = '10' THEN 'Octubre'
                    WHEN DATE_FORMAT(ADDDATE(MAX(fecha_cliente), INTERVAL 1 MONTH), '%m') = '11' THEN 'Noviembre'
                    WHEN DATE_FORMAT(ADDDATE(MAX(fecha_cliente), INTERVAL 1 MONTH), '%m') = '12' THEN 'Diciembre'
                END AS nombre_siguiente_mes
            FROM clientes_mes cmes
            JOIN tb_clientes tc ON DATE_FORMAT(tc.fecha_cliente, '%Y-%m') = cmes.mes
            CROSS JOIN calculos c
        )
        SELECT
            cmes.mes,
            cmes.clientes_mensuales,
            cmes.nombre_mes,
            p.prediccion_siguiente_mes,
            p.nombre_siguiente_mes
        FROM clientes_mes cmes
        CROSS JOIN prediccion p
        ORDER BY cmes.mes ASC;";
        $params = array();
        return Database::getRows($sql, $params);
    }

    //Metodo para saber cantidad de total de pedidos hechas por los clientes
    public function readClientesPedidos()
    {
        $sql = 'SELECT CONCAT(c.nombre_cliente, " " ,c.apellido_cliente) AS nombre, COUNT(p.id_pedido) AS cantidad_pedidos
                FROM tb_clientes c
                LEFT JOIN tb_pedidos p ON c.id_cliente = p.id_cliente
                WHERE p.estado_pedido = "Finalizado"
                GROUP BY c.id_cliente, c.nombre_cliente, c.apellido_cliente
                ORDER BY cantidad_pedidos DESC;';
        return Database::getRows($sql);
    }

    // Método para generar reporte : Cantidad de pedidos por un cliente
    public function readPedidosClienteID()
    {
        $sql = 'SELECT p.id_pedido, p.fecha_pedido AS fecha_registro, c.nombre_cliente, p.codigo_pedido AS codigoPedido, GROUP_CONCAT(DISTINCT pr.descripcion_producto ORDER BY pr.descripcion_producto ASC SEPARATOR ", ") AS productos_pedidos, SUM(dp.cantidad_pedido) AS cantidad_productos_pedidos
                FROM tb_pedidos p
                INNER JOIN tb_clientes c ON p.id_cliente = c.id_cliente
                INNER JOIN tb_detalle_pedidos dp ON p.id_pedido = dp.id_pedido
                INNER JOIN tb_productos pr ON dp.id_producto = pr.id_producto
                WHERE c.id_cliente = ?
                GROUP BY p.id_pedido, p.fecha_pedido, c.nombre_cliente, p.codigo_pedido;
        ';
        $params = array($this->id);
        return Database::getRows($sql, $params);
    }
}
