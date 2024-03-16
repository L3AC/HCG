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
  estado_cliente BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (id_cliente)
);


CREATE TABLE tb_tipo_items(
  id_tipo_item INT UNSIGNED auto_increment,
  descripcion_item VARCHAR(255) NOT NULL
  estado_item BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (id_tipo_item)
);

CREATE TABLE tb_items(
  id_item INT UNSIGNED auto_increment,
  id_tipo_item INT UNSIGNED ,/*BEBIDA, PLATO, SNACK,*/
  nombre_item VARCHAR(255) NOT NULL,
  descripcion_item VARCHAR(255)  NOT NULL,
  precio_item DECIMAL(10, 2) NOT NULL,
  estado_item BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (id_item)
);

CREATE TABLE tb_horarios(
  id_horario INT UNSIGNED auto_increment,
  descripcion_horario VARCHAR(255) NOT NULL,
  estado_horario INT UNSIGNED  NOT NULL
);

CREATE TABLE tb_combos(
  id_combo INT UNSIGNED auto_increment,
  descripcion_combo VARCHAR(255) NOT NULL,
  precio_combo DECIMAL(10, 2) NOT NULL,
  lunes_combo BOOLEAN NOT NULL,
  martes_combo BOOLEAN NOT NULL,
  miercoles_combo BOOLEAN NOT NULL,
  jueves_combo BOOLEAN NOT NULL,
  viernes_combo BOOLEAN NOT NULL,
  sabado_combo BOOLEAN NOT NULL,
  domingo_combo BOOLEAN NOT NULL
  PRIMARY KEY (id_combo)
);

CREATE TABLE tb_horarios_combos(
  id_horario_combo INT UNSIGNED auto_increment,
  id_horario INT UNSIGNED  NOT NULL,/*DESAYUNO, ALMUERZO, CENA,TIPICO*/
  id_combo INT UNSIGNED  NOT NULL,
  PRIMARY KEY (id_horario_combo)
);

CREATE TABLE tb_items_combos(
  id_item_combo INT UNSIGNED auto_increment,
  id_item INT UNSIGNED  NOT NULL,/*DESAYUNO, ALMUERZO, CENA,TIPICO*/
  id_combo INT UNSIGNED  NOT NULL,
  PRIMARY KEY (id_item_combo)
);

CREATE TABLE tb_pedidos(
    id_pedido INT UNSIGNED NOT NULL,
    id_cliente INT UNSIGNED  NOT NULL,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    estado_pedido enum('Pendiente','Entregado')
    PRIMARY KEY (id_pedido)
);

CREATE TABLE tb_detalle_pedidos(
    id_pedido INT,
    id_producto INT,
    cantidad INT,
    PRIMARY KEY (id_pedido, id_producto),
    FOREIGN KEY (id_pedido) REFERENCES Pedidos(id),
    FOREIGN KEY (id_producto) REFERENCES Productos(id)
);
