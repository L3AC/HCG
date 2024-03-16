DROP DATABASE db_hgc;
CREATE DATABASE IF NOT EXISTS db_hgc;
USE db_hgc;

CREATE TABLE tb_roles(
  
);

CREATE TABLE tb_usuarios(
  id_usuario INT UNSIGNED auto_increment,
  id_rol INT UNSIGNED NOT NULL,
  alias_usuario VARCHAR(30) UNIQUE NOT NULL,
  clave_usuario VARCHAR(255) NOT NULL,
  nombre_usuario VARCHAR(255) NOT NULL,
  apellido_usuario VARCHAR(255) NOT NULL,
  email_usuario VARCHAR(100) NOT NULL,
  pin_usuario VARCHAR(6) NOT NULL,
  estado_usuario BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (id_usuario),
  CONSTRAINT fk_usuario_rol /*LLAVE FORANEA*/
  FOREIGN KEY(id_rol) REFERENCES sec_roles(id_rol)
  ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE tb_clientes_pedidos(
  id_cliente INT UNSIGNED auto_increment, 
  
);

CREATE TABLE tb_tipo_productos(
  id_tipo_producto INT UNSIGNED auto_increment,
  
);

CREATE TABLE tb_productos(
  id_producto INT UNSIGNED auto_increment,
  id_tipo_producto INT UNSIGNED ,/*LLAVE FORANEA*/
  nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL
);

CREATE TABLE tb_menus(
  id_menu INT UNSIGNED,
  fecha TIMESTAMP
);

CREATE TABLE tb_menu_productos(
    id_menu INT UNSIGNED,
    id_producto INT UNSIGNED,
    PRIMARY KEY (id_menu, id_producto),
    FOREIGN KEY (id_menu) REFERENCES tb_menus(id),
    FOREIGN KEY (id_producto) REFERENCES tb_productos(id)
);

CREATE TABLE tb_pedidos(
    id_pedido INT UNSIGNED
    id_cliente INT UNSIGNED
);

CREATE TABLE tb_detalle_pedidos(
    id_pedido INT,
    id_producto INT,
    cantidad INT,
    PRIMARY KEY (id_pedido, id_producto),
    FOREIGN KEY (id_pedido) REFERENCES Pedidos(id),
    FOREIGN KEY (id_producto) REFERENCES Productos(id)
);
