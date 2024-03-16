DROP DATABASE db_hgc;
CREATE DATABASE IF NOT EXISTS db_hgc;
USE db_hgc;

CREATE TABLE tb_roles(
  id_rol INT UNSIGNED auto_increment,
  descripcion_rol VARCHAR(100) NOT NULL,
  estado_rol BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (id_rol)
);

CREATE TABLE tb_usuarios(
  id_usuario INT UNSIGNED auto_increment,
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
  id_cliente INT UNSIGNED auto_increment,
  alias_cliente VARCHAR(30) UNIQUE NOT NULL,
  clave_cliente VARCHAR(255) NOT NULL,
  telefono_cliente VARCHAR(255) NOT NULL,
  nombre_cliente VARCHAR(255) NOT NULL,
  apellido_cliente VARCHAR(255) NOT NULL,
  email_cliente VARCHAR(255) NOT NULL,
  pin_cliente VARCHAR(6) NOT NULL,
  estado_cliente BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (id_cliente)
);


CREATE TABLE tb_tipo_productos(
  id_tipo_producto INT UNSIGNED auto_increment,
  descripcion_tipo_producto VARCHAR(255) NOT NULL,
  estado_tipo_producto BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (id_tipo_producto)
);

CREATE TABLE tb_items(
  id_item INT UNSIGNED auto_increment,
  #id_tipo_item INT UNSIGNED ,/*BEBIDA, PLATO, SNACK,*/
  nombre_item VARCHAR(255) NOT NULL,
  descripcion_item VARCHAR(255)  NOT NULL,
  precio_item DECIMAL(10, 2) NOT NULL,
  estado_item BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (id_item)
  /*CONSTRAINT fk_item_tipo 
  FOREIGN KEY(id_tipo_item) REFERENCES tb_tipo_items(id_tipo_item)*/
);

/*D = Desayuno, A = Almuerzo, C = Cena, T = Tipico,TD = Todo el dia
  D-A = Desayuno y Almuerzo, D-C = Desayuno y Cena, A-C = Almuerzo y Cena
  T-D = Tipico y Desayuno , T-A = Tipico y Almuerzo T-C = Tipico y Cena
*/
CREATE TABLE tb_productos(
  id_producto INT UNSIGNED auto_increment,
  id_tipo_producto INT UNSIGNED,
  descripcion_producto VARCHAR(255) NOT NULL,
  horario_producto ENUM('D','A','C','T','TD','D-A','D-C','A-C','T-D','TA','T-C') NOT NULL,
  precio_producto DECIMAL(10, 2) NOT NULL,
  lunes_producto BOOLEAN NOT NULL,
  martes_producto BOOLEAN NOT NULL,
  miercoles_producto BOOLEAN NOT NULL,
  jueves_producto BOOLEAN NOT NULL,
  viernes_producto BOOLEAN NOT NULL,
  sabado_producto BOOLEAN NOT NULL,
  domingo_producto BOOLEAN NOT NULL,
  PRIMARY KEY (id_producto),
  CONSTRAINT fk_tipo_producto
  FOREIGN KEY(id_tipo_producto) REFERENCES tb_tipo_productos(id_tipo_producto) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE tb_detalle_productos(
  id_detalle_producto INT UNSIGNED auto_increment,
  id_item INT UNSIGNED  NOT NULL,
  id_producto INT UNSIGNED  NOT NULL, /*TRAE EL ID DEL producto*/
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
    estado_pedido enum('Pendiente','Entregado') NOT NULL,
    PRIMARY KEY (id_pedido),
    CONSTRAINT fk_pedido_cliente 
    FOREIGN KEY(id_cliente) REFERENCES tb_clientes(id_cliente) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE tb_detalle_pedidos (
  id_detalle_pedido INT UNSIGNED AUTO_INCREMENT,
  id_pedido INT UNSIGNED NOT NULL,
  id_producto INT UNSIGNED NOT NULL,
  cantidad INT UNSIGNED NOT NULL,
  PRIMARY KEY (id_detalle_pedido),
  FOREIGN KEY (id_pedido) REFERENCES tb_pedidos(id_pedido) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_producto) REFERENCES tb_productos(id_producto) ON DELETE CASCADE ON UPDATE CASCADE
);

