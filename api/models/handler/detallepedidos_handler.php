<?php
// Se incluye la clase para trabajar con la base de datos.
require_once('../../helpers/database.php');
/*
*	Clase para manejar el comportamiento de los datos de la tabla PRODUCTO.
*/
class DetallePedidoHandler
{
    /*
    *   Declaración de atributos para el manejo de datos.
    */
    protected $id = null;
    protected $id_pedido = null;
    protected $cantidad = null;
    protected $nota = null;
    protected $search = null;
    protected $idModelo = null;
    protected $idTalla = null;
    protected $nombre = null;
    protected $descripcion = null;
    protected $precio = null;
    protected $existencias = null;
    protected $imagen = null;
    protected $categoria = null;
    protected $estado = null;

    // Constante para establecer la ruta de las imágenes.
    const RUTA_IMAGEN = '../../images/modelos/';

    /*
    *   Métodos para realizar las operaciones SCRUD (search, create, read, update, and delete).
    */

    // Método para buscar filas que coincidan con el valor de búsqueda.
    public function searchRows($value)
    {
        $value = $value === '' ? '%%' : '%' . $value . '%';

        $sql = 'select id_detalle_pedido,id_pedido,id_producto,cantidad_pedido,
        descripcion_producto,imagen_producto,precio_producto,
        precio_producto * cantidad_pedido AS total_pedido,nota_pedido
        from tb_detalle_pedidos
        INNER JOIN tb_productos USING(id_producto)
        WHERE id_pedido=? AND descripcion_producto like ?
        ORDER BY tipo_producto';

        $params = array($this->id, $value);
        return Database::getRows($sql, $params);
    }

    // Método para buscar el historial de pedidos finalizados.
    public function searchHistorial()
    {
        $this->search = $this->search === '' ? '%%' : '%' . $this->search . '%';

        $sql = 'SELECT id_cliente,id_detalle_pedido,id_producto,id_pedido,cantidad_pedido, 
        DATE_FORMAT(fecha_pedido, "%h:%i %p - %e %b %Y") AS fecha_pedido,
		descripcion_producto,precio_producto,cantidad_pedido,imagen_producto,
		(precio_producto*cantidad_pedido) as subtotal
        from tb_detalle_pedidos
        INNER JOIN tb_pedidos USING (id_pedido)
        INNER JOIN tb_productos USING (id_producto)
        WHERE estado_pedido ="Finalizado" AND id_cliente=? AND (descripcion_producto like ?)
        ORDER BY descripcion_producto';

        $params = array($_SESSION['idCliente'], $this->search);
        return Database::getRows($sql, $params);
    }

    // Método para buscar detalles de pedido por ID de pedido.
    public function searchByPedido()
    {
        //$this->search = $this->search === '' ? '%%' : '%' . $this->search . '%';

        $sql = 'SELECT id_cliente,id_detalle_pedido,id_producto,id_pedido,cantidad_pedido, nota_pedido,
        DATE_FORMAT(fecha_pedido, "%h:%i %p - %e %b %Y") AS fecha_pedido,
		descripcion_producto,precio_producto,cantidad_pedido,imagen_producto,
		(precio_producto*cantidad_pedido) as subtotal
        from tb_detalle_pedidos
        INNER JOIN tb_pedidos USING (id_pedido)
        INNER JOIN tb_productos USING (id_producto) 
        WHERE id_pedido=?
        ORDER BY descripcion_producto';

        $params = array($this->id_pedido/*,$this->search*/);
        return Database::getRows($sql, $params);
    }

    // Método para crear un nuevo registro.
    public function createRow()
    {
        $sql = 'INSERT INTO prc_modelo_tallas(id_talla, id_modelo, stock_modelo_talla, precio_modelo_talla)
                VALUES(?, ?, ?, ?)';
        $params = array($this->idTalla, $this->idModelo, $this->existencias, $this->precio);
        return Database::executeRow($sql, $params);
    }

    // Método para leer todas las filas de la tabla.
    public function readAll()
    {
        $sql = 'select mt.id_modelo_talla,mt.id_talla,mt.id_modelo,mt.stock_modelo_talla,
        mt.precio_modelo_talla,t.descripcion_talla as talla
        from prc_modelo_tallas mt 
        INNER JOIN ctg_tallas t USING(id_talla)
        INNER JOIN prc_modelos m USING(id_modelo)
        WHERE mt.id_modelo = ?
        ORDER BY t.descripcion_talla';
        //echo $this->idModelo. ' que';
        $params = array($this->idModelo);

        return Database::getRows($sql, $params);
    }

    // Método para leer una fila específica de detalle_pedidos.
    public function readOne()
    {
        $sql = 'select * from tb_detalle_pedidos where id_detalle_pedido=?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    // Método para leer el nombre de archivo de la imagen de un modelo.
    public function readFilename()
    {
        $sql = 'SELECT foto
                FROM prc_modelos
                WHERE id_modelo = ?';
        $params = array($this->id);
        return Database::getRow($sql, $params);
    }

    // Método para actualizar una fila de detalle_pedidos.
    public function updateRow()
    {
        $sql = 'UPDATE tb_detalle_pedidos 
                SET cantidad_pedido = ?, nota_pedido = ?
                WHERE id_detalle_pedido = ?';
        $params = array($this->cantidad, $this->nota, $this->id);
        return Database::executeRow($sql, $params);
    }

    // Método para eliminar una fila de detalle_pedidos.
    public function deleteRow()
    {
        $sql = 'DELETE FROM tb_detalle_pedidos
                WHERE id_detalle_pedido = ?';
        $params = array($this->id);
        return Database::executeRow($sql, $params);
    }

    // Método para leer productos por categoría.
    public function readProductosCategoria()
    {
        $sql = 'SELECT mo.id_modelo, mo.descripcion,mo.foto, mo.estado,ma.descripcion as marca
        FROM prc_modelos mo
        INNER JOIN ctg_marcas ma USING(id_marca)
        WHERE mo.id_marca LIKE ? OR estado="A"
        ORDER BY mo.descripcion';
            /*'SELECT id_producto, imagen_producto, nombre_producto, descripcion_producto, precio_producto, existencias_producto
                FROM producto
                INNER JOIN categoria USING(id_categoria)
                WHERE id_categoria = ? AND estado_producto = true
                ORDER BY nombre_producto'*/;
        $params = array($this->categoria);
        return Database::getRows($sql, $params);
    }

    /*
    *   Métodos para generar gráficos.
    */

    // Método para obtener la cantidad de productos por categoría.
    public function cantidadProductosCategoria()
    {
        $sql = 'SELECT nombre_categoria, COUNT(id_producto) cantidad
                FROM producto
                INNER JOIN categoria USING(id_categoria)
                GROUP BY nombre_categoria ORDER BY cantidad DESC LIMIT 5';
        return Database::getRows($sql);
    }

    // Método para obtener el porcentaje de productos por categoría.
    public function porcentajeProductosCategoria()
    {
        $sql = 'SELECT nombre_categoria, ROUND((COUNT(id_producto) * 100.0 / (SELECT COUNT(id_producto) FROM producto)), 2) porcentaje
                FROM producto
                INNER JOIN categoria USING(id_categoria)
                GROUP BY nombre_categoria ORDER BY porcentaje DESC';
        return Database::getRows($sql);
    }

    /*
    *   Métodos para generar reportes.
    */

    // Método para obtener productos por categoría.
    public function productosCategoria()
    {
        $sql = 'SELECT nombre_producto, precio_producto, estado_producto
                FROM producto
                INNER JOIN categoria USING(id_categoria)
                WHERE id_categoria = ?
                ORDER BY nombre_producto';
        $params = array($this->categoria);
        return Database::getRows($sql, $params);
    }
    public function topClientes()
    {
        $sql = 'SELECT 
    c.nombre_cliente,
    c.apellido_cliente,
    c.correo_cliente,
    COUNT(ped.id_pedido) AS cantidad_pedidos_finalizados
    FROM 
        tb_pedidos ped
    INNER JOIN 
        tb_clientes c ON ped.id_cliente = c.id_cliente
    WHERE 
        ped.estado_pedido = "Finalizado"
    GROUP BY 
        c.id_cliente, c.nombre_cliente, c.apellido_cliente, c.correo_cliente
    ORDER BY 
        cantidad_pedidos_finalizados DESC
        LIMIT ' . $this->id . ';';
        $params = array();
        return Database::getRows($sql, $params);
    }
    public function topConjuntos()
    {
        $sql = 'SELECT p.descripcion_producto, COUNT(dp.id_producto) AS cantidad_pedidos
        FROM 
            tb_detalle_pedidos dp
        INNER JOIN 
            tb_productos p ON dp.id_producto = p.id_producto
        INNER JOIN 
            tb_pedidos ped ON dp.id_pedido = ped.id_pedido
        WHERE 
            p.tipo_producto = "Conjunto"
            AND ped.fecha_pedido >= DATE_SUB(CURDATE(), INTERVAL ' . $this->id . ' MONTH)
        GROUP BY 
            dp.id_producto, p.descripcion_producto
        ORDER BY dp.id_producto';
        $params = array();
        return Database::getRows($sql, $params);
    }
    public function topComplementos()
    {
        $sql = 'SELECT 
        p.descripcion_producto, 
        COUNT(dp.id_producto) AS cantidad_pedidos
        FROM 
            tb_detalle_pedidos dp
        INNER JOIN 
            tb_productos p ON dp.id_producto = p.id_producto
        INNER JOIN 
            tb_pedidos ped ON dp.id_pedido = ped.id_pedido
        WHERE 
            p.tipo_producto = "Complementario"
            AND ped.fecha_pedido >= DATE_SUB(CURDATE(), INTERVAL ' . $this->id . ' MONTH)
        GROUP BY 
            dp.id_producto, p.descripcion_producto
        ORDER BY dp.id_producto';
        $params = array();
        return Database::getRows($sql, $params);
    }
    public function topCategorias()
    {
        $sql = 'SELECT 
        ti.descripcion_tipo_item,
        COUNT(dp.id_item) AS cantidad_items_pedidos
        FROM tb_detalle_productos dp
        INNER JOIN tb_items i ON dp.id_item = i.id_item
        INNER JOIN tb_tipo_items ti ON i.id_tipo_item = ti.id_tipo_item
        GROUP BY ti.descripcion_tipo_item
        ORDER BY cantidad_items_pedidos DESC
        LIMIT ' . $this->id . ';';
        $params = array();
        return Database::getRows($sql, $params);
    }
    public function topHorarios()
    {
        $sql = 'SELECT 
    horario_individual AS horario_producto, 
    COUNT(*) AS cantidad_pedidos,
    ROUND((COUNT(*) * 100.0 / total.total_pedidos), 1) AS porcentaje
FROM (
    SELECT 
        dp.id_detalle_pedido, 
        dp.id_producto,
        ped.id_pedido,
        CASE
            WHEN p.horario_producto = "Todo el día" THEN
                CASE
                    WHEN TIME(ped.fecha_pedido) BETWEEN "06:00:00" AND "11:00:00" THEN "Desayuno"
                    WHEN TIME(ped.fecha_pedido) BETWEEN "11:00:00" AND "15:00:00" THEN "Almuerzo"
                    WHEN TIME(ped.fecha_pedido) BETWEEN "15:00:00" AND "18:00:00" THEN "Típico"
                    WHEN TIME(ped.fecha_pedido) BETWEEN "18:00:00" AND "22:00:00" THEN "Cena"
                    ELSE "Desayuno" -- Considerar un horario por defecto si no entra en ninguno de los anteriores
                END
            ELSE
                CASE
                    WHEN p.horario_producto LIKE "%Desayuno%" THEN "Desayuno"
                    WHEN p.horario_producto LIKE "%Almuerzo%" THEN "Almuerzo"
                    WHEN p.horario_producto LIKE "%Típico%" THEN "Típico"
                    WHEN p.horario_producto LIKE "%Cena%" THEN "Cena"
                END
        END AS horario_individual
    FROM 
        tb_detalle_pedidos dp
    INNER JOIN 
        tb_pedidos ped ON dp.id_pedido = ped.id_pedido
    INNER JOIN 
        tb_productos p ON dp.id_producto = p.id_producto
    WHERE 
        ped.fecha_pedido >= DATE_SUB(CURDATE(), INTERVAL ' . $this->id . ' MONTH)
) AS subquery
CROSS JOIN (
    SELECT 
        COUNT(*) AS total_pedidos 
    FROM 
        tb_detalle_pedidos dp
    INNER JOIN 
        tb_pedidos ped ON dp.id_pedido = ped.id_pedido
    WHERE 
        ped.fecha_pedido >= DATE_SUB(CURDATE(), INTERVAL ' . $this->id . ' MONTH)
) total
WHERE
    horario_individual IN ("Desayuno", "Almuerzo", "Típico", "Cena")
GROUP BY 
    horario_individual
ORDER BY 
    cantidad_pedidos DESC;
';
        $params = array();
        return Database::getRows($sql, $params);
    }
    public function prediccionGanancia(){
       
        $sql="
        WITH ventas AS ( 
    SELECT DATE_FORMAT(ped.fecha_pedido, '%Y-%m') AS mes, 
           ROUND(SUM(dp.cantidad_pedido * prod.precio_producto), 2) AS ventas_mensuales,
           CASE
               WHEN DATE_FORMAT(ped.fecha_pedido, '%m') = '01' THEN 'Enero'
               WHEN DATE_FORMAT(ped.fecha_pedido, '%m') = '02' THEN 'Febrero'
               WHEN DATE_FORMAT(ped.fecha_pedido, '%m') = '03' THEN 'Marzo'
               WHEN DATE_FORMAT(ped.fecha_pedido, '%m') = '04' THEN 'Abril'
               WHEN DATE_FORMAT(ped.fecha_pedido, '%m') = '05' THEN 'Mayo'
               WHEN DATE_FORMAT(ped.fecha_pedido, '%m') = '06' THEN 'Junio'
               WHEN DATE_FORMAT(ped.fecha_pedido, '%m') = '07' THEN 'Julio'
               WHEN DATE_FORMAT(ped.fecha_pedido, '%m') = '08' THEN 'Agosto'
               WHEN DATE_FORMAT(ped.fecha_pedido, '%m') = '09' THEN 'Septiembre'
               WHEN DATE_FORMAT(ped.fecha_pedido, '%m') = '10' THEN 'Octubre'
               WHEN DATE_FORMAT(ped.fecha_pedido, '%m') = '11' THEN 'Noviembre'
               WHEN DATE_FORMAT(ped.fecha_pedido, '%m') = '12' THEN 'Diciembre'
           END AS nombre_mes,
           ROW_NUMBER() OVER (ORDER BY DATE_FORMAT(ped.fecha_pedido, '%Y-%m')) AS mes_indice
    FROM tb_pedidos ped
    JOIN tb_detalle_pedidos dp ON ped.id_pedido = dp.id_pedido
    JOIN tb_productos prod ON dp.id_producto = prod.id_producto
    WHERE ped.estado_pedido = 'Finalizado'
    GROUP BY mes, nombre_mes
    ORDER BY mes DESC
    LIMIT  ".$this->id."
),
coeficientes AS (
    SELECT COUNT(*) AS n, SUM(mes_indice) AS sum_x, SUM(ventas_mensuales) AS sum_y, 
           SUM(mes_indice * ventas_mensuales) AS sum_xy, SUM(mes_indice * mes_indice) AS sum_xx 
    FROM ventas
),
calculos AS (
    SELECT 
        (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x) AS slope,
        (sum_y - ((n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x)) * sum_x) / n AS intercept
    FROM coeficientes
)
SELECT v.mes, v.ventas_mensuales, v.nombre_mes, 
       ROUND(c.slope * (v.mes_indice + 1) + c.intercept, 2) AS prediccion_siguiente_mes,
       CASE
           WHEN DATE_FORMAT(ADDDATE(DATE(CONCAT(v.mes, '-01')), INTERVAL 1 MONTH), '%m') = '01' THEN 'Enero'
           WHEN DATE_FORMAT(ADDDATE(DATE(CONCAT(v.mes, '-01')), INTERVAL 1 MONTH), '%m') = '02' THEN 'Febrero'
           WHEN DATE_FORMAT(ADDDATE(DATE(CONCAT(v.mes, '-01')), INTERVAL 1 MONTH), '%m') = '03' THEN 'Marzo'
           WHEN DATE_FORMAT(ADDDATE(DATE(CONCAT(v.mes, '-01')), INTERVAL 1 MONTH), '%m') = '04' THEN 'Abril'
           WHEN DATE_FORMAT(ADDDATE(DATE(CONCAT(v.mes, '-01')), INTERVAL 1 MONTH), '%m') = '05' THEN 'Mayo'
           WHEN DATE_FORMAT(ADDDATE(DATE(CONCAT(v.mes, '-01')), INTERVAL 1 MONTH), '%m') = '06' THEN 'Junio'
           WHEN DATE_FORMAT(ADDDATE(DATE(CONCAT(v.mes, '-01')), INTERVAL 1 MONTH), '%m') = '07' THEN 'Julio'
           WHEN DATE_FORMAT(ADDDATE(DATE(CONCAT(v.mes, '-01')), INTERVAL 1 MONTH), '%m') = '08' THEN 'Agosto'
           WHEN DATE_FORMAT(ADDDATE(DATE(CONCAT(v.mes, '-01')), INTERVAL 1 MONTH), '%m') = '09' THEN 'Septiembre'
           WHEN DATE_FORMAT(ADDDATE(DATE(CONCAT(v.mes, '-01')), INTERVAL 1 MONTH), '%m') = '10' THEN 'Octubre'
           WHEN DATE_FORMAT(ADDDATE(DATE(CONCAT(v.mes, '-01')), INTERVAL 1 MONTH), '%m') = '11' THEN 'Noviembre'
           WHEN DATE_FORMAT(ADDDATE(DATE(CONCAT(v.mes, '-01')), INTERVAL 1 MONTH), '%m') = '12' THEN 'Diciembre'
       END AS nombre_siguiente_mes
FROM ventas v
JOIN calculos c
ORDER BY v.mes ASC;";
        $params = array();
        return Database::getRows($sql, $params);
    }
    public function graficaItems(){
        $sql="SELECT tb_items.descripcion_item,SUM(tb_detalle_productos.cantidad_item) AS total_cantidad,
        ROUND((SUM(tb_detalle_productos.cantidad_item) / total.total_cantidad_general) * 100, 1) AS porcentaje
        FROM tb_detalle_productos
        INNER JOIN tb_items ON tb_detalle_productos.id_item = tb_items.id_item
        CROSS JOIN (SELECT SUM(cantidad_item) AS total_cantidad_general FROM tb_detalle_productos) AS total
        GROUP BY tb_items.descripcion_item, total.total_cantidad_general
        ORDER BY total_cantidad DESC
        LIMIT ".$this->id.";";
        $params = array();
        return Database::getRows($sql, $params);

    }
}
