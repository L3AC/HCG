use db_hcg;

INSERT INTO tb_roles (id_rol, descripcion_rol, estado_rol, productos_opc, pedidos_opc, tipo_items_opc, items_opc, clientes_opc, usuarios_opc, roles_opc)
VALUES ((SELECT get_next_id('tb_roles')), 'Aministrador', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE);

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
"https://forevertwentysomethings.com/wp-content/uploads/2016/10/tacos-768x469.jpg",true,false,false,true,false,true,true,true),
((SELECT get_next_id("tb_productos")),"Conjunto","Pasta Alfredo","Almuerzo y Cena",12,
"https://www.tureceta.net/wp-content/uploads/2019/12/Pasta-Alfredo.jpg",true,false,true,false,true,true,false,true),
((SELECT get_next_id("tb_productos")),"Conjunto","Sopa de pollo","Almuerzo y Cena",6,
"https://i.ytimg.com/vi/i-9EeaO2MM8/maxresdefault.jpg",true,false,false,true,false,true,false,true),
((SELECT get_next_id("tb_productos")),"Complementario","Ensalada mixta","Almuerzo y Cena",7,
"https://lirp.cdn-website.com/43d8542e/dms3rep/multi/opt/AdobeStock_77449575-1920w.jpeg",true,false,true,false,true,true,false,true),
((SELECT get_next_id("tb_productos")),"Conjunto","Hamburguesa de pollo","Todo el día",5.5,
"https://restaurantes.mesa247.pe/archivos/local/foto/2020/05/mtlxi-foto-fotonetflix3-new-your-burger-chacarilla-1.jpg",true,true,true,true,true,true,true,true),
((SELECT get_next_id("tb_productos")),"Conjunto","Sandwich club","Todo el día",6.5,
"https://www.cucinare.tv/wp-content/uploads/2020/06/S%C3%A1ndwich-Club.jpg",true,true,true,true,true,true,true,true),
((SELECT get_next_id("tb_productos")),"Complementario","Tiramisú","Cena",4.5,
"https://mui.kitchen/__export/1604882392531/sites/muikitchen/img/2020/11/08/receta-tiramisu-italiano.jpg_1103262588.jpg",true,false,false,false,true,false,false,true),
((SELECT get_next_id("tb_productos")),"Complementario","Fruta fresca","Todo el día",3.5,
"https://d2d8wwwkmhfcva.cloudfront.net/800x/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_b2c11e1a-b4b0-43e6-936d-7c66c1e5fd9c.jpg",true,true,true,true,true,true,true,true);


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