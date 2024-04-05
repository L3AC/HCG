DROP DATABASE IF EXISTS db_hcg;
CREATE DATABASE IF NOT EXISTS db_hcg;
USE db_hcg;

CREATE TABLE tb_roles(
  id_rol INT UNSIGNED /*auto_increment*/,
  descripcion_rol VARCHAR(100) NOT NULL,
  estado_rol BOOLEAN DEFAULT TRUE,
  productos_opc BOOLEAN NOT NULL,
  pedidos_opc BOOLEAN NOT NULL,
  tipo_items_opc BOOLEAN NOT NULL,
  items_opc BOOLEAN NOT NULL,
  clientes_opc BOOLEAN NOT NULL,
  usuarios_opc BOOLEAN NOT NULL,
  roles_opc BOOLEAN NOT NULL,
  PRIMARY KEY (id_rol)
);

CREATE TABLE tb_usuarios(
  id_usuario INT UNSIGNED /*auto_increment*/,
  id_rol INT UNSIGNED,
  alias_usuario VARCHAR(30) UNIQUE NOT NULL,
  clave_usuario VARCHAR(255) NOT NULL,
  nombre_usuario VARCHAR(255) NOT NULL,
  apellido_usuario VARCHAR(255) NOT NULL,
  email_usuario VARCHAR(255) NOT NULL,
  pin_usuario VARCHAR(6) NOT NULL,
  estado_usuario BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (id_usuario),
  CONSTRAINT fk_usuario_rol /*LLAVE FORANEA*/
  FOREIGN KEY(id_rol) REFERENCES tb_roles(id_rol)
  ON DELETE CASCADE ON UPDATE CASCADE
);
        

CREATE TABLE tb_clientes(
  id_cliente INT UNSIGNED /*auto_increment*/,
  telefono_cliente VARCHAR(255) NOT NULL,
  correo_cliente VARCHAR(255) NOT NULL,
  nombre_cliente VARCHAR(255) NOT NULL,
  apellido_cliente VARCHAR(255) NOT NULL,
  PRIMARY KEY (id_cliente)
);

/*ESTO VA A SERVIR PARA INGRESAR POR EJEMPLO, CATEGORIA DE BEBIDAS, SNACKS, POSTRE, PORCION DE UN PLATILLO*/
CREATE TABLE tb_tipo_items(
  id_tipo_item INT UNSIGNED /*auto_increment*/,
  descripcion_tipo_item VARCHAR(255) NOT NULL,
  estado_tipo_item BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (id_tipo_item)
);


CREATE TABLE tb_items(
  id_item INT UNSIGNED /*auto_increment*/,
  id_tipo_item INT UNSIGNED ,/*BEBIDA, PLATO, SNACK,*/
  descripcion_item VARCHAR(255) NOT NULL,
  estado_item BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (id_item),
  CONSTRAINT fk_item_tipo 
  FOREIGN KEY(id_tipo_item) REFERENCES tb_tipo_items(id_tipo_item)
);

CREATE TABLE tb_productos(
  id_producto INT UNSIGNED /*auto_increment*/,
  tipo_producto ENUM('Conjunto','Complementario') NOT NULL,
  descripcion_producto VARCHAR(255) NOT NULL,
  horario_producto ENUM('Desayuno','Almuerzo','Cena','Típico','Todo el día','Desayuno y Almuerzo',
  'Desayuno y Cena','Almuerzo y Cena','Típico y Desayuno','Típico y Almuerzo','Tipico y Cena') NOT NULL,
  precio_producto DECIMAL(10, 2) NOT NULL,
  imagen_producto LONGTEXT,
  estado_producto BOOLEAN NOT NULL,
  lunes_producto BOOLEAN NOT NULL,
  martes_producto BOOLEAN NOT NULL,
  miercoles_producto BOOLEAN NOT NULL,
  jueves_producto BOOLEAN NOT NULL,
  viernes_producto BOOLEAN NOT NULL,
  sabado_producto BOOLEAN NOT NULL,
  domingo_producto BOOLEAN NOT NULL,
  PRIMARY KEY (id_producto)
);

CREATE TABLE tb_detalle_productos(
  id_detalle_producto INT UNSIGNED /*auto_increment*/,
  id_item INT UNSIGNED  NOT NULL,
  id_producto INT UNSIGNED  NOT NULL, /*TRAE EL ID DEL producto*/
  cantidad_item INT UNSIGNED NOT NULL,
  PRIMARY KEY (id_detalle_producto),
  CONSTRAINT fk_item_producto_item /*LLAVE FORANEA*/
  FOREIGN KEY(id_item) REFERENCES tb_items(id_item)
  ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_item_producto_producto /*LLAVE FORANEA*/
  FOREIGN KEY(id_producto) REFERENCES tb_productos(id_producto) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE tb_pedidos(
    id_pedido INT UNSIGNED NOT NULL,
    id_cliente INT UNSIGNED  NOT NULL,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    codigo_pedido VARCHAR(30) NOT NULL,
    estado_pedido enum('Pendiente','Finalizado') NOT NULL,
    PRIMARY KEY (id_pedido),
    CONSTRAINT fk_pedido_cliente 
    FOREIGN KEY(id_cliente) REFERENCES tb_clientes(id_cliente) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE tb_detalle_pedidos (
  id_detalle_pedido INT UNSIGNED /*auto_increment*/,
  id_pedido INT UNSIGNED NOT NULL,
  id_producto INT UNSIGNED NOT NULL,
  cantidad_pedido INT UNSIGNED NOT NULL,
  PRIMARY KEY (id_detalle_pedido),
  FOREIGN KEY (id_pedido) REFERENCES tb_pedidos(id_pedido) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_producto) REFERENCES tb_productos(id_producto) ON DELETE CASCADE ON UPDATE CASCADE
);

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
        
