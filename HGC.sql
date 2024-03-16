DROP DATABASE db_hgc;
CREATE DATABASE IF NOT EXISTS db_hgc;
USE db_hgc;

CREATE TABLE tb_roles(
  id_rol INT UNSIGNED auto_increment,
  descripcion_rol VARCHAR(100) NOT NULL,
  estado_rol BOOLEAN DEFAULT TRUE
);

CREATE TABLE tb_usuarios(
  id_usuario INT UNSIGNED auto_increment,
  id_rol UNSIGNED,
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
  id_cliente INT UNSIGNED auto_increment,
  alias_cliente VARCHAR(30) UNIQUE NOT NULL,
  clave_cliente VARCHAR(255) NOT NULL,
  telefono_cliente VARCHAR(255) NOT NULL,
  nombre_cliente VARCHAR(255) NOT NULL,
  apellido_cliente VARCHAR(255) NOT NULL,
  email_cliente VARCHAR(255) NOT NULL,
  pin_cliente VARCHAR(6) NOT NULL,
  estado_cliente BOOLEAN DEFAULT TRUE
);


CREATE TABLE tb_tipo_items(
  id_tipo_item INT UNSIGNED auto_increment,
  descripcion_item VARCHAR(255) NOT NULL
  estado_item BOOLEAN DEFAULT TRUE
);

CREATE TABLE tb_items(
  id_producto INT UNSIGNED auto_increment,
  id_tipo_items INT UNSIGNED ,/*LLAVE FORANEA*/
  nombre_item VARCHAR(255) NOT NULL,
  descripcion_item TEXT,
  precio_item DECIMAL(10, 2) NOT NULL
);

CREATE TABLE tb_combo(
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
