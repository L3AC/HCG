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

