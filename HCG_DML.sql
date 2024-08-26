use db_hcg;

INSERT INTO tb_roles (id_rol, descripcion_rol, estado_rol, productos_opc, pedidos_opc, tipo_items_opc, items_opc, clientes_opc, usuarios_opc, roles_opc)
VALUES ((SELECT get_next_id('tb_roles')), 'Aministrador', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE),
((SELECT get_next_id('tb_roles')), 'Cajero', TRUE, TRUE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE);

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
"https://d2d8wwwkmhfcva.cloudfront.net/800x/d2lnr5mha7bycj.cloudfront.net/product-image/file/large_b2c11e1a-b4b0-43e6-936d-7c66c1e5fd9c.jpg",true,true,true,true,true,true,true,true),
((SELECT get_next_id("tb_productos")), "Complementario", "Pan de Ajo", "Todo el día", 4.0,
"https://1.bp.blogspot.com/-kJK-2rEMj40/W-7MkDM_beI/AAAAAAAAe9s/uansbl6rmPwGw6eFgHfTfafmPSX2cmd_QCLcBGAs/s1600/Pan%2Bde%2Bajo%2B01.jpg", true, true, true, true, true, true, true, true),
((SELECT get_next_id("tb_productos")), "Complementario", "Guacamole", "Todo el día", 5.0,
"https://www.thespruceeats.com/thmb/0KXm7SVduHXRaqbv1xM755yPEDU=/4048x2696/filters:fill(auto,1)/simple-guacamole-recipe-2342710-hero-01-0abcdd8e923c41788d0c38230cd7d86e.jpg", true, true, true, true, true, true, true, true),
((SELECT get_next_id("tb_productos")), "Complementario", "Papas Fritas", "Todo el día", 3.0,
"https://cdn.kiwilimon.com/recetaimagen/15785/7818.jpg", true, true, true, true, true, true, true, true),
((SELECT get_next_id("tb_productos")), "Complementario", "Aros de Cebolla", "Todo el día", 5.5,
"https://www.notiactual.com/wp-content/uploads/2017/02/Aros-de-cebolla.jpg", true, true, true, true, true, true, true, true);


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

INSERT INTO tb_clientes(id_cliente,usuario_cliente,clave_cliente,nombre_cliente,apellido_cliente,telefono_cliente,correo_cliente, fecha_cliente)
VALUES
((SELECT get_next_id("tb_clientes")),"Juan","$2y$10$aP8t6cRWFw29VBpgbNrLWuwDvQVME1O8kRzquocN8h/YgNKVtm/je","Juan","Hernandez","71926778","leac.2xy@gmail.com", '2024-01-15 10:30:00'),
((SELECT get_next_id("tb_clientes")),"Maria","$2y$10$aP8t6cRWFw29VBpgbNrLWuwDvQVME1O8kRzquocN8h/YgNKVtm/je","Maria","Rodriguez","71000701","mariarod@gmail.com", '2024-02-20 14:45:00'),
((SELECT get_next_id("tb_clientes")),"Carlos","$2y$10$aP8t6cRWFw29VBpgbNrLWuwDvQVME1O8kRzquocN8h/YgNKVtm/je","Carlos","Perez","71926602","carlosperez@gmail.com", '2024-03-05 09:10:00'),
((SELECT get_next_id("tb_clientes")),"Ana","$2y$10$aP8t6cRWFw29VBpgbNrLWuwDvQVME1O8kRzquocN8h/YgNKVtm/je","Ana","Diaz","71926703","anadiaz@gmail.com", '2024-04-12 11:20:00'),
((SELECT get_next_id("tb_clientes")),"Luis","$2y$10$aP8t6cRWFw29VBpgbNrLWuwDvQVME1O8kRzquocN8h/YgNKVtm/je","Luis","Sanchez","71000704","luissanc@gmail.com", '2024-05-22 16:55:00'),
((SELECT get_next_id("tb_clientes")),"Laura","$2y$10$aP8t6cRWFw29VBpgbNrLWuwDvQVME1O8kRzquocN8h/YgNKVtm/je","Laura","Ramirez","71926605","lauraram@gmail.com", '2024-06-08 08:35:00'),
((SELECT get_next_id("tb_clientes")),"Javier","$2y$10$aP8t6cRWFw29VBpgbNrLWuwDvQVME1O8kRzquocN8h/YgNKVtm/je","Javier","Garcia","71926706","javiergar@gmail.com", '2024-07-17 13:40:00'),
((SELECT get_next_id("tb_clientes")),"Sofia","$2y$10$aP8t6cRWFw29VBpgbNrLWuwDvQVME1O8kRzquocN8h/YgNKVtm/je","Sofia","Martinez","71000707","sofiamtz@gmail.com", '2024-08-25 19:15:00'),
((SELECT get_next_id("tb_clientes")),"Diego","$2y$10$aP8t6cRWFw29VBpgbNrLWuwDvQVME1O8kRzquocN8h/YgNKVtm/je","Diego","Flores","71926608","diegoflores@gmail.com", '2024-02-03 14:50:00'),
((SELECT get_next_id("tb_clientes")),"Lucia","$2y$10$aP8t6cRWFw29VBpgbNrLWuwDvQVME1O8kRzquocN8h/YgNKVtm/je","Lucia","Gutierrez","71926709","luciagtz@gmail.com", '2024-03-14 07:25:00'),
((SELECT get_next_id("tb_clientes")),"Fernando","$2y$10$aP8t6cRWFw29VBpgbNrLWuwDvQVME1O8kRzquocN8h/YgNKVtm/je","Fernando","Ramos","71926710","fernandoramos@gmail.com", '2024-04-23 12:15:00'),
((SELECT get_next_id("tb_clientes")),"Elena","$2y$10$aP8t6cRWFw29VBpgbNrLWuwDvQVME1O8kRzquocN8h/YgNKVtm/je","Elena","Lopez","71000711","elenalopez@gmail.com", '2024-05-31 17:05:00');

INSERT INTO tb_usuarios(id_usuario, id_rol, alias_usuario, clave_usuario, nombre_usuario, apellido_usuario, email_usuario, pin_usuario, fecha_usuario)
VALUES
((SELECT get_next_id("tb_usuarios")), 1, "jhernandez", "$2y$10$aP8t6cRWFw29VBpgbNrLWuwDvQVME1O8kRzquocN8h/YgNKVtm/je", "Juan", "Hernandez", "leac.2xy@gmail.com", "123456", '2024-01-15 10:00:00'),
((SELECT get_next_id("tb_usuarios")), 2, "mrodriguez", "$2y$10$aP8t6cRWFw29VBpgbNrLWuwDvQVME1O8kRzquocN8h/YgNKVtm/je", "Maria", "Rodriguez", "mariarod@gmail.com", "654321", '2024-02-15 10:00:00'),
((SELECT get_next_id("tb_usuarios")), 2, "cperez", "$2y$10$aP8t6cRWFw29VBpgbNrLWuwDvQVME1O8kRzquocN8h/YgNKVtm/je", "Carlos", "Perez", "carlosperez@gmail.com", "abcdef", '2024-03-15 10:00:00'),
((SELECT get_next_id("tb_usuarios")), 2, "adiaz", "$2y$10$aP8t6cRWFw29VBpgbNrLWuwDvQVME1O8kRzquocN8h/YgNKVtm/je", "Ana", "Diaz", "anadiaz@gmail.com", "fedcba", '2024-04-15 10:00:00'),
((SELECT get_next_id("tb_usuarios")), 2, "lsanchez", "$2y$10$aP8t6cRWFw29VBpgbNrLWuwDvQVME1O8kRzquocN8h/YgNKVtm/je", "Luis", "Sanchez", "luissanc@gmail.com", "112233", '2024-05-15 10:00:00'),
((SELECT get_next_id("tb_usuarios")), 2, "lramirez", "$2y$10$aP8t6cRWFw29VBpgbNrLWuwDvQVME1O8kRzquocN8h/YgNKVtm/je", "Laura", "Ramirez", "lauraram@gmail.com", "332211", '2024-06-15 10:00:00'),
((SELECT get_next_id("tb_usuarios")), 2, "jgarcia", "$2y$10$aP8t6cRWFw29VBpgbNrLWuwDvQVME1O8kRzquocN8h/YgNKVtm/je", "Javier", "Garcia", "javiergar@gmail.com", "a1b2c3", '2024-07-15 10:00:00'),
((SELECT get_next_id("tb_usuarios")), 2, "smartinez", "$2y$10$aP8t6cRWFw29VBpgbNrLWuwDvQVME1O8kRzquocN8h/YgNKVtm/je", "Sofia", "Martinez", "sofiamtz@gmail.com", "c3b2a1", '2024-08-15 10:00:00');


-- Insertar pedidos
INSERT INTO tb_pedidos (id_pedido, id_cliente, estado_pedido, codigo_pedido, fecha_pedido)
VALUES 
((SELECT get_next_id('tb_pedidos')), 1, 'Finalizado', generar_codigo(), '2024-01-15 10:00:00'),
((SELECT get_next_id('tb_pedidos')), 2, 'Finalizado', generar_codigo(), '2024-01-15 10:00:00'),
((SELECT get_next_id('tb_pedidos')), 3, 'Finalizado', generar_codigo(), '2024-02-15 10:00:00'),
((SELECT get_next_id('tb_pedidos')), 4, 'Finalizado', generar_codigo(), '2024-02-15 10:00:00'),
((SELECT get_next_id('tb_pedidos')), 5, 'Finalizado', generar_codigo(), '2024-03-15 10:00:00'),
((SELECT get_next_id('tb_pedidos')), 6, 'Finalizado', generar_codigo(), '2024-03-15 10:00:00'),
((SELECT get_next_id('tb_pedidos')), 7, 'Finalizado', generar_codigo(), '2024-04-15 10:00:00'),
((SELECT get_next_id('tb_pedidos')), 8, 'Finalizado', generar_codigo(), '2024-05-15 10:00:00'),
((SELECT get_next_id('tb_pedidos')), 9, 'Finalizado', generar_codigo(), '2024-06-15 10:00:00'),
((SELECT get_next_id('tb_pedidos')), 10, 'Finalizado', generar_codigo(), '2024-06-15 10:00:00'),
((SELECT get_next_id('tb_pedidos')), 10, 'Finalizado', generar_codigo(), '2024-07-15 11:00:00'),
((SELECT get_next_id('tb_pedidos')), 9, 'Finalizado', generar_codigo(), '2024-07-15 12:00:00'),
((SELECT get_next_id('tb_pedidos')), 8, 'Finalizado', generar_codigo(), '2024-07-15 13:00:00');

-- Insertar detalles de pedidos
INSERT INTO tb_detalle_pedidos (id_detalle_pedido, id_pedido, id_producto, cantidad_pedido)
VALUES 
((SELECT get_next_id('tb_detalle_pedidos')), 1, (SELECT id_producto FROM tb_productos WHERE descripcion_producto = 'Combo Hamburguesa'), 2),
((SELECT get_next_id('tb_detalle_pedidos')), 1, (SELECT id_producto FROM tb_productos WHERE descripcion_producto = 'Tacos de carne asada'), 1),
((SELECT get_next_id('tb_detalle_pedidos')), 2, (SELECT id_producto FROM tb_productos WHERE descripcion_producto = 'Pasta Alfredo'), 2),
((SELECT get_next_id('tb_detalle_pedidos')), 2, (SELECT id_producto FROM tb_productos WHERE descripcion_producto = 'Sopa de pollo'), 1),
((SELECT get_next_id('tb_detalle_pedidos')), 3, (SELECT id_producto FROM tb_productos WHERE descripcion_producto = 'Nachos Preparados'), 3),
((SELECT get_next_id('tb_detalle_pedidos')), 4, (SELECT id_producto FROM tb_productos WHERE descripcion_producto = 'Hamburguesa de pollo'), 1),
((SELECT get_next_id('tb_detalle_pedidos')), 5, (SELECT id_producto FROM tb_productos WHERE descripcion_producto = 'Sandwich club'), 2),
((SELECT get_next_id('tb_detalle_pedidos')), 5, (SELECT id_producto FROM tb_productos WHERE descripcion_producto = 'Fruta fresca'), 1),
((SELECT get_next_id('tb_detalle_pedidos')), 6, (SELECT id_producto FROM tb_productos WHERE descripcion_producto = 'Tiramisú'), 2),
((SELECT get_next_id('tb_detalle_pedidos')), 7, (SELECT id_producto FROM tb_productos WHERE descripcion_producto = 'Ensalada mixta'), 1),
((SELECT get_next_id('tb_detalle_pedidos')), 8, (SELECT id_producto FROM tb_productos WHERE descripcion_producto = 'Combo Hamburguesa'), 2),
((SELECT get_next_id('tb_detalle_pedidos')), 8, (SELECT id_producto FROM tb_productos WHERE descripcion_producto = 'Tacos de carne asada'), 1),
((SELECT get_next_id('tb_detalle_pedidos')), 9, (SELECT id_producto FROM tb_productos WHERE descripcion_producto = 'Pasta Alfredo'), 1),
((SELECT get_next_id('tb_detalle_pedidos')), 9, (SELECT id_producto FROM tb_productos WHERE descripcion_producto = 'Sopa de pollo'), 2),
((SELECT get_next_id('tb_detalle_pedidos')), 10, (SELECT id_producto FROM tb_productos WHERE descripcion_producto = 'Nachos Preparados'), 2),
((SELECT get_next_id('tb_detalle_pedidos')), 11, (SELECT id_producto FROM tb_productos WHERE descripcion_producto = 'Ensalada mixta'), 2),
((SELECT get_next_id('tb_detalle_pedidos')), 11, (SELECT id_producto FROM tb_productos WHERE descripcion_producto = 'Papas Fritas'), 3),
((SELECT get_next_id('tb_detalle_pedidos')), 12, (SELECT id_producto FROM tb_productos WHERE descripcion_producto = 'Guacamole'), 1),
((SELECT get_next_id('tb_detalle_pedidos')), 12, (SELECT id_producto FROM tb_productos WHERE descripcion_producto = 'Aros de Cebolla'), 2),
((SELECT get_next_id('tb_detalle_pedidos')), 13, (SELECT id_producto FROM tb_productos WHERE descripcion_producto = 'Fruta fresca'), 1),
((SELECT get_next_id('tb_detalle_pedidos')), 13, (SELECT id_producto FROM tb_productos WHERE descripcion_producto = 'Tiramisú'), 2);

