use db_hcg;

DELIMITER //
CREATE FUNCTION get_next_id(table_name VARCHAR(255))
RETURNS INT UNSIGNED
BEGIN
    DECLARE next_id INT UNSIGNED;
    
    CASE table_name
        WHEN 'tb_roles' THEN
            SELECT IFNULL(MAX(id_rol), 0) + 1 INTO next_id FROM tb_roles;
        WHEN 'tb_usuarios' THEN
            SELECT IFNULL(MAX(id_usuario), 0) + 1 INTO next_id FROM tb_usuarios;
        WHEN 'tb_clientes' THEN
            SELECT IFNULL(MAX(id_cliente), 0) + 1 INTO next_id FROM tb_clientes;
        WHEN 'tb_tipo_items' THEN
            SELECT IFNULL(MAX(id_tipo_item), 0) + 1 INTO next_id FROM tb_tipo_items;
        WHEN 'tb_items' THEN
            SELECT IFNULL(MAX(id_item), 0) + 1 INTO next_id FROM tb_items;
        WHEN 'tb_productos' THEN
            SELECT IFNULL(MAX(id_producto), 0) + 1 INTO next_id FROM tb_productos;
        WHEN 'tb_detalle_productos' THEN
            SELECT IFNULL(MAX(id_detalle_producto), 0) + 1 INTO next_id FROM tb_detalle_productos;
		WHEN 'tb_detalle_pedidos' THEN
            SELECT IFNULL(MAX(id_detalle_pedido), 0) + 1 INTO next_id FROM tb_detalle_pedidos;
        WHEN 'tb_pedidos' THEN
            SELECT IFNULL(MAX(id_pedido), 0) + 1 INTO next_id FROM tb_pedidos;
    END CASE;
    
    RETURN next_id;
END //
DELIMITER ;

DELIMITER //
CREATE FUNCTION generar_codigo() RETURNS VARCHAR(6)
BEGIN
    DECLARE codigo VARCHAR(6);
    SET codigo = '';
    REPEAT
        SET codigo = '';
        WHILE LENGTH(codigo) < 6 DO
            SET codigo = CONCAT(codigo, SUBSTRING('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', RAND() * 62 + 1, 1));
        END WHILE;
    UNTIL NOT EXISTS (SELECT 1 FROM tb_pedidos WHERE DATE(fecha_pedido) = CURDATE() AND codigo_pedido = codigo) END REPEAT;
    RETURN codigo;
END//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE InsertarProducto(IN tipo_producto VARCHAR(255),IN descripcion_producto VARCHAR(255),IN horario_producto VARCHAR(255),
IN precio_producto DECIMAL(10,2),IN imagen_producto VARCHAR(255),IN estado_producto BOOLEAN,IN lunes_producto BOOLEAN,IN martes_producto BOOLEAN,
IN miercoles_producto BOOLEAN,IN jueves_producto BOOLEAN,IN viernes_producto BOOLEAN,IN sabado_producto BOOLEAN,IN domingo_producto BOOLEAN
)
BEGIN
    INSERT INTO tb_productos (id_producto,tipo_producto,descripcion_producto,horario_producto,precio_producto,imagen_producto,estado_producto,
        lunes_producto,martes_producto,miercoles_producto,jueves_producto,viernes_producto,sabado_producto,domingo_producto
    ) 
    VALUES (
        (SELECT get_next_id("tb_productos")),tipo_producto,descripcion_producto,horario_producto,precio_producto,imagen_producto,
        estado_producto,lunes_producto,martes_producto,miercoles_producto,jueves_producto,viernes_producto,sabado_producto,domingo_producto
    );
END //
DELIMITER ;


