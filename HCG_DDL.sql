use db_hcg;
/*CREACION DE USUARIO
CREATE USER hcg_desarrollador IDENTIFIED BY '123456';
GRANT INSERT, UPDATE, DELETE, SELECT ON db_hcg.* TO hcg_desarrollador@'localhost';
GRANT EXECUTE ON db_hcg.* TO hcg_desarrollador@'localhost';
GRANT CREATE ROUTINE ON db_hcg.* TO hcg_desarrollador@'localhost';
GRANT TRIGGER ON db_hcg.* TO hcg_desarrollador@'localhost';
GRANT CREATE VIEW ON db_hcg.* TO hcg_desarrollador@'localhost';
*/
 
/*FUNCION QUE ME DEVUELVE EL ID SIGUIENTE QUE SE REGISTRARIA EN ORDEN Y SE MANDA A QUE TABLA SE AGARRARIA
ESTO SE USA EN LUGAR DEL AUTO_INCREMENT*/
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

/*FUNCION QUE ME DEVUELVE UN CODIGO  DE 6 DIGITOS EL CUAL VERIFICA QUE NO SE REPITA EN LA FECHA ACTUAL*/
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

/*PROCEDIMIENTO ALMACENADO PARA INSERTAR UN PRODUCTO*/
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

#TRIGGER 
/*VERIFICA QUE PRODUCTO EL CUAL SE VA A ESOGER ESTE DENTRO DEL HORARIO Y DIA DISPONIBLE*/
DELIMITER //
CREATE TRIGGER before_detalle_pedido_insert
BEFORE INSERT ON tb_detalle_pedidos
FOR EACH ROW
BEGIN
    DECLARE v_disponible BOOLEAN;

    -- Verificar disponibilidad del producto en el horario y día correspondiente
    SELECT COUNT(*)
    INTO v_disponible
    FROM tb_productos
    WHERE estado_producto = 1 AND tipo_producto = "Conjunto"
    AND (
        (DAYOFWEEK(NOW()) = 1 AND domingo_producto = 1)
        OR (DAYOFWEEK(NOW()) = 2 AND lunes_producto = 1)
        OR (DAYOFWEEK(NOW()) = 3 AND martes_producto = 1)
        OR (DAYOFWEEK(NOW()) = 4 AND miercoles_producto = 1)
        OR (DAYOFWEEK(NOW()) = 5 AND jueves_producto = 1)
        OR (DAYOFWEEK(NOW()) = 6 AND viernes_producto = 1)
        OR (DAYOFWEEK(NOW()) = 7 AND sabado_producto = 1)
    )
    AND (
        (horario_producto = "Desayuno" AND TIME(NOW()) BETWEEN "06:00:00" AND "11:00:00")
        OR (horario_producto = "Almuerzo" AND TIME(NOW()) BETWEEN "11:00:00" AND "15:00:00")
        OR (horario_producto = "Típico" AND TIME(NOW()) BETWEEN "15:00:00" AND "18:00:00")
        OR (horario_producto = "Cena" AND TIME(NOW()) BETWEEN "18:00:00" AND "22:00:00")
        OR (horario_producto = "Todo el día")
        OR (horario_producto = "Desayuno y Almuerzo" AND (TIME(NOW()) BETWEEN "06:00:00" AND "11:00:00" OR TIME(NOW()) BETWEEN "11:00:00" AND "15:00:00"))
        OR (horario_producto = "Desayuno y Cena" AND (TIME(NOW()) BETWEEN "06:00:00" AND "11:00:00" OR TIME(NOW()) BETWEEN "18:00:00" AND "22:00:00"))
        OR (horario_producto = "Almuerzo y Cena" AND (TIME(NOW()) BETWEEN "11:00:00" AND "15:00:00" OR TIME(NOW()) BETWEEN "18:00:00" AND "22:00:00"))
        OR (horario_producto = "Típico y Desayuno" AND (TIME(NOW()) BETWEEN "06:00:00" AND "10:00:00" OR TIME(NOW()) BETWEEN "15:00:00" AND "18:00:00"))
        OR (horario_producto = "Típico y Almuerzo" AND (TIME(NOW()) BETWEEN "11:00:00" AND "15:00:00" OR TIME(NOW()) BETWEEN "18:00:00" AND "22:00:00"))
        OR (horario_producto = "Típico y Cena" AND (TIME(NOW()) BETWEEN "06:00:00" AND "10:00:00" OR TIME(NOW()) BETWEEN "15:00:00" AND "18:00:00"))
    );

    IF v_disponible = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El producto solicitado no está disponible en este horario';
    END IF;
END;
//DELIMITER ;
