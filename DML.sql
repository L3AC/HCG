use db_hcg2;

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
		WHEN 'tb_opciones_cambio' THEN
            SELECT IFNULL(MAX(id_opcion_cambio), 0) + 1 INTO next_id FROM tb_opciones_cambio;
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


INSERT INTO tb_roles (id_rol, descripcion_rol, estado_rol, productos_opc, pedidos_opc, tipo_items_opc, items_opc, clientes_opc, usuarios_opc, roles_opc)
VALUES ((SELECT get_next_id('tb_roles')), 'Aministrador', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE);

INSERT INTO tb_tipo_items(id_tipo_item,descripcion_tipo_item,estado_tipo_item) 
VALUES((SELECT get_next_id("tb_tipo_items")),"Bebida",true),
((SELECT get_next_id("tb_tipo_items")),"Snack",true),
((SELECT get_next_id("tb_tipo_items")),"Postre",true),
((SELECT get_next_id("tb_tipo_items")),"Porción de plato",true);

INSERT INTO tb_items(id_item,id_tipo_item,descripcion_item,estado_item) 
VALUES
((SELECT get_next_id("tb_items")),1,"Lata Coca Cola 550ml",true),
((SELECT get_next_id("tb_items")),1,"Lata Sprite 550ml",true),
((SELECT get_next_id("tb_items")),1,"Fresco de Sandia",true),
((SELECT get_next_id("tb_items")),2,"Nachos Diana",true),
((SELECT get_next_id("tb_items")),3,"Budín",true),
((SELECT get_next_id("tb_items")),4,"Porción de arroz",true),
((SELECT get_next_id("tb_items")),4,"Papas Fritas",true),
((SELECT get_next_id("tb_items")),4,"Ensalada Fresca",true),
((SELECT get_next_id("tb_items")),4,"Ensalada Rusa",true),
((SELECT get_next_id("tb_items")),4,"Pechuga a la parilla",true);


INSERT INTO tb_productos (id_producto,tipo_producto,descripcion_producto,horario_producto,precio_producto,
imagen_producto,estado_producto,lunes_producto,martes_producto,miercoles_producto,jueves_producto,
viernes_producto,sabado_producto,domingo_producto) 
VALUES((SELECT get_next_id("tb_productos")),"Conjunto","Nachos Preparados","Todo el día",2,
"https://www.straightupfood.com/blog/wp-content/uploads/2023/04/Nachos_FI_7251-2.jpg",
true,true,true,true,true,true,true,true),
((SELECT get_next_id("tb_productos")),"Conjunto","Combo Hamburgues","Todo el día",3,
"https://t2.gstatic.com/licensed-image?q=tbn:ANd9GcRRto3I
lY56MlAIOAvXHvPEVxBDVzG1uz1zULEBYdJ-I4Aa-xOyPEVvv7fmIjLnxaOz",true,true,true,true,true,true,true,true);

INSERT INTO tb_detalle_productos (id_detalle_producto, id_item_padre, id_item_hijo,
id_producto, cantidad_item,estado,cambiable)
VALUES((SELECT get_next_id("tb_detalle_productos")),1,1,1,TRUE),
((SELECT get_next_id("tb_detalle_productos")),2,1,1,TRUE),
((SELECT get_next_id("tb_detalle_productos")),3,1,1,TRUE),
((SELECT get_next_id("tb_detalle_productos")),4,1,1,FALSE);

INSERT INTO tb_clientes(id_cliente,nombre_cliente,apellido_cliente,telefono_cliente,correo_cliente)
VALUES((SELECT get_next_id("tb_clientes")),"Juan","Hernandez","50371926778","leac.2xy@gmail.com"),
((SELECT get_next_id("tb_clientes")),"Rosa","Martinez","50371000778","rosamart@gmail.com"),
((SELECT get_next_id("tb_clientes")),"Emma","Lopez","50371926678","emmalop@gmail.com");

INSERT INTO tb_pedidos (id_pedido, id_cliente,estado_pedido,codigo_pedido)
VALUES ((SELECT get_next_id("tb_pedidos")), 1,'Pendiente',generar_codigo());

INSERT INTO tb_detalle_pedidos (id_detalle_pedido,id_pedido, id_producto, cantidad_pedido)
VALUES((SELECT get_next_id("tb_detalle_pedidos")),1, 1, 2),
((SELECT get_next_id("tb_detalle_pedidos")),1, 2, 1);

/*
INSERT INTO tb_tipo_items(id_tipo_item,descripcion_tipo_item,estado_tipo_item) 
VALUES((SELECT get_next_id("tb_tipo_items")),"Bebida",true),
((SELECT get_next_id("tb_tipo_items")),"Snack",true),
((SELECT get_next_id("tb_tipo_items")),"Postre",true),
((SELECT get_next_id("tb_tipo_items")),"Porción de plato",true),
((SELECT get_next_id("tb_tipo_items")),"Botana",true),
((SELECT get_next_id("tb_tipo_items")),"Sopa",true),
((SELECT get_next_id("tb_tipo_items")),"Ensalada",true),
((SELECT get_next_id("tb_tipo_items")),"Entrada",true),
((SELECT get_next_id("tb_tipo_items")),"Plato fuerte",true),
((SELECT get_next_id("tb_tipo_items")),"Bebida Alcoholica",true);

INSERT INTO tb_items(id_item,id_tipo_item,descripcion_item,estado_item) 
VALUES
((SELECT get_next_id("tb_items")),1,"Lata Coca Cola 550ml",true),
((SELECT get_next_id("tb_items")),2,"Nachos Diana",true),
((SELECT get_next_id("tb_items")),3,"Budín",true),
((SELECT get_next_id("tb_items")),4,"Porción de arroz",true),
((SELECT get_next_id("tb_items")),4,"Ensalada Fresca",true),
((SELECT get_next_id("tb_items")),4,"Pechuga a la parilla",true),
((SELECT get_next_id("tb_items")),6,"Sopa de pollo",true),
((SELECT get_next_id("tb_items")),8,"Entrada de queso",true),
((SELECT get_next_id("tb_items")),5,"Chips de tortilla",true),
((SELECT get_next_id("tb_items")),10,"Whisky 12 años",true);

INSERT INTO tb_productos (id_producto,tipo_producto,descripcion_producto,horario_producto,precio_producto,
imagen_producto,estado_producto,lunes_producto,martes_producto,miercoles_producto,jueves_producto,
viernes_producto,sabado_producto,domingo_producto) 
VALUES((SELECT get_next_id("tb_productos")),"Conjunto","Nachos Preparados","Todo el día",2,
"https://www.straightupfood.com/blog/wp-content/uploads/2023/04/Nachos_FI_7251-2.jpg",
true,true,true,true,true,true,true,true),
((SELECT get_next_id("tb_productos")),"Conjunto","Combo Hamburguesa","Todo el día",3,
"https://t2.gstatic.com/licensed-image?q=tbn:ANd9GcRRto3I
lY56MlAIOAvXHvPEVxBDVzG1uz1zULEBYdJ-I4Aa-xOyPEVvv7fmIjLnxaOz",true,true,true,true,true,true,true,true),
((SELECT get_next_id("tb_productos")),"Conjunto","Tacos de carne asada","Almuerzo y Cena",10,
"https://www.example.com/tacos_image.jpg",true,false,false,true,false,true,true,true),
((SELECT get_next_id("tb_productos")),"Conjunto","Pasta Alfredo","Almuerzo y Cena",12,
"https://www.example.com/pasta_image.jpg",true,false,true,false,true,true,false,true),
((SELECT get_next_id("tb_productos")),"Complementario","Sopa de pollo","Almuerzo y Cena",6,
"https://www.example.com/chicken_soup_image.jpg",true,false,false,true,false,true,false,true),
((SELECT get_next_id("tb_productos")),"Complementario","Ensalada mixta","Almuerzo y Cena",7,
"https://www.example.com/mixed_salad_image.jpg",true,false,true,false,true,true,false,true),
((SELECT get_next_id("tb_productos")),"Conjunto","Hamburguesa de pollo","Todo el día",5.5,
"https://www.example.com/chicken_burger_image.jpg",true,true,true,true,true,true,true,true),
((SELECT get_next_id("tb_productos")),"Conjunto","Sandwich club","Todo el día",6.5,
"https://www.example.com/sandwich_image.jpg",true,true,true,true,true,true,true,true),
((SELECT get_next_id("tb_productos")),"Complementario","Tiramisú","Cena",4.5,
"https://www.example.com/tiramisu_image.jpg",true,false,false,false,true,false,false,true),
((SELECT get_next_id("tb_productos")),"Complementario","Fruta fresca","Todo el día",3.5,
"https://www.example.com/fruit_image.jpg",true,true,true,true,true,true,true,true);


INSERT INTO tb_detalle_productos(id_detalle_producto,id_item,id_producto,cantidad_item) 
VALUES((SELECT get_next_id("tb_detalle_productos")),1,1,1),
((SELECT get_next_id("tb_detalle_productos")),2,1,1),
((SELECT get_next_id("tb_detalle_productos")),7,3,1),
((SELECT get_next_id("tb_detalle_productos")),8,4,1),
((SELECT get_next_id("tb_detalle_productos")),9,5,1),
((SELECT get_next_id("tb_detalle_productos")),10,6,1),
((SELECT get_next_id("tb_detalle_productos")),2,7,1),
((SELECT get_next_id("tb_detalle_productos")),2,8,1),
((SELECT get_next_id("tb_detalle_productos")),1,9,1),
((SELECT get_next_id("tb_detalle_productos")),4,10,1);

INSERT INTO tb_clientes(id_cliente,nombre_cliente,apellido_cliente,telefono_cliente,correo_cliente)
VALUES((SELECT get_next_id("tb_clientes")),"Juan","Hernandez","50371926778","leac.2xy@gmail.com"),
((SELECT get_next_id("tb_clientes")),"Maria","Rodriguez","50371000701","mariarod@gmail.com"),
((SELECT get_next_id("tb_clientes")),"Carlos","Perez","50371926602","carlosperez@gmail.com"),
((SELECT get_next_id("tb_clientes")),"Ana","Diaz","50371926703","anadiaz@gmail.com"),
((SELECT get_next_id("tb_clientes")),"Luis","Sanchez","50371000704","luissanc@gmail.com"),
((SELECT get_next_id("tb_clientes")),"Laura","Ramirez","50371926605","lauraram@gmail.com"),
((SELECT get_next_id("tb_clientes")),"Javier","Garcia","50371926706","javiergar@gmail.com"),
((SELECT get_next_id("tb_clientes")),"Sofia","Martinez","50371000707","sofiamtz@gmail.com"),
((SELECT get_next_id("tb_clientes")),"Diego","Flores","50371926608","diegoflores@gmail.com"),
((SELECT get_next_id("tb_clientes")),"Lucia","Gutierrez","50371926709","luciagtz@gmail.com");

INSERT INTO tb_pedidos (id_pedido, id_cliente,estado_pedido,codigo_pedido)
VALUES 
((SELECT get_next_id("tb_pedidos")), 1,'Pendiente',generar_codigo()),
((SELECT get_next_id("tb_pedidos")), 2,'Pendiente',generar_codigo()),
((SELECT get_next_id("tb_pedidos")), 3,'Pendiente',generar_codigo()),
((SELECT get_next_id("tb_pedidos")), 4,'Pendiente',generar_codigo()),
((SELECT get_next_id("tb_pedidos")), 5,'Pendiente',generar_codigo()),
((SELECT get_next_id("tb_pedidos")), 6,'Pendiente',generar_codigo()),
((SELECT get_next_id("tb_pedidos")), 7,'Pendiente',generar_codigo()),
((SELECT get_next_id("tb_pedidos")), 8,'Pendiente',generar_codigo()),
((SELECT get_next_id("tb_pedidos")), 9,'Pendiente',generar_codigo()),
((SELECT get_next_id("tb_pedidos")), 10,'Pendiente',generar_codigo());

INSERT INTO tb_detalle_pedidos (id_detalle_pedido,id_pedido, id_producto, cantidad_pedido)
VALUES((SELECT get_next_id("tb_detalle_pedidos")),1, 1, 2),
((SELECT get_next_id("tb_detalle_pedidos")),1, 2, 1),
((SELECT get_next_id("tb_detalle_pedidos")),2, 3, 3),
((SELECT get_next_id("tb_detalle_pedidos")),2, 4, 2),
((SELECT get_next_id("tb_detalle_pedidos")),3, 5, 1),
((SELECT get_next_id("tb_detalle_pedidos")),3, 6, 2),
((SELECT get_next_id("tb_detalle_pedidos")),4, 7, 1),
((SELECT get_next_id("tb_detalle_pedidos")),4, 8, 3),
((SELECT get_next_id("tb_detalle_pedidos")),5, 9, 2),
((SELECT get_next_id("tb_detalle_pedidos")),5, 10, 1);
*/


