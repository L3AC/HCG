use db_hcg;

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
((SELECT get_next_id("tb_items")),2,"Nachos Diana",true),
((SELECT get_next_id("tb_items")),3,"Budín",true),
((SELECT get_next_id("tb_items")),4,"Porción de arroz",true),
((SELECT get_next_id("tb_items")),4,"Ensalada Fresca",true),
((SELECT get_next_id("tb_items")),4,"Pechuga a la parilla",true);

INSERT INTO tb_productos (id_producto,tipo_producto,descripcion_producto,horario_producto,precio_producto,
imagen_producto,estado_producto,lunes_producto,martes_producto,miercoles_producto,jueves_producto,
viernes_producto,sabado_producto,domingo_producto) 
VALUES((SELECT get_next_id("tb_productos")),"Conjunto","Nachos Preparados","Todo el día",2,
"https://www.straightupfood.com/blog/wp-content/uploads/2023/04/Nachos_FI_7251-2.jpg",
true,true,true,true,true,true,true,true);

INSERT INTO tb_productos (id_producto,tipo_producto,descripcion_producto,horario_producto,precio_producto,
imagen_producto,estado_producto,lunes_producto,martes_producto,miercoles_producto,jueves_producto,
viernes_producto,sabado_producto,domingo_producto) 
VALUES((SELECT get_next_id("tb_productos")),"Conjunto","Combo Hamburgues","Todo el día",3,
"https://t2.gstatic.com/licensed-image?q=tbn:ANd9GcRRto3I
lY56MlAIOAvXHvPEVxBDVzG1uz1zULEBYdJ-I4Aa-xOyPEVvv7fmIjLnxaOz",true,true,true,true,true,true,true,true);

INSERT INTO tb_detalle_productos(id_detalle_producto,id_item,id_producto,cantidad_item) 
VALUES((SELECT get_next_id("tb_detalle_productos")),1,1,1),
((SELECT get_next_id("tb_detalle_productos")),2,1,1);

INSERT INTO tb_clientes(id_cliente,nombre_cliente,apellido_cliente,telefono_cliente,correo_cliente)
VALUES((SELECT get_next_id("tb_clientes")),"Juan","Hernandez","50371926778","leac.2xy@gmail.com"),
((SELECT get_next_id("tb_clientes")),"Rosa","Martinez","50371000778","rosamart@gmail.com"),
((SELECT get_next_id("tb_clientes")),"Emma","Lopez","50371926678","emmalop@gmail.com");

INSERT INTO tb_pedidos (id_pedido, id_cliente,estado_pedido,codigo_pedido)
VALUES ((SELECT get_next_id("tb_pedidos")), 1,'Pendiente',generar_codigo());

INSERT INTO tb_detalle_pedidos (id_detalle_pedido,id_pedido, id_producto, cantidad_pedido)
VALUES((SELECT get_next_id("tb_detalle_pedidos")),1, 1, 2),
((SELECT get_next_id("tb_detalle_pedidos")),1, 2, 1);