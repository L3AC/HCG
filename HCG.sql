DROP DATABASE IF EXISTS db_hcg;
CREATE DATABASE IF NOT EXISTS db_hcg;
USE db_hcg;

CREATE TABLE tb_roles(
  id_rol INT UNSIGNED,
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
  id_usuario INT UNSIGNED,
  id_rol INT UNSIGNED,
  alias_usuario VARCHAR(30) NOT NULL,
  clave_usuario VARCHAR(255) NOT NULL,
  nombre_usuario VARCHAR(255) NOT NULL,
  apellido_usuario VARCHAR(255) NOT NULL,
  email_usuario VARCHAR(255) NOT NULL,
  pin_usuario VARCHAR(6) NOT NULL,
  estado_usuario BOOLEAN DEFAULT TRUE,
  fecha_usuario TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  intentos_usuario INT UNSIGNED DEFAULT 0,
  fecha_reactivacion TIMESTAMP NULL DEFAULT NULL,
  ultimo_intento TIMESTAMP NULL DEFAULT NULL,
  ultimo_cambio_clave TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY (id_usuario),
  CONSTRAINT alias_usuario UNIQUE (alias_usuario),
  CONSTRAINT fk_usuario_rol
  FOREIGN KEY(id_rol) REFERENCES tb_roles(id_rol)
);


CREATE TABLE tb_clientes(
  id_cliente INT UNSIGNED,
  usuario_cliente VARCHAR(255) NOT NULL,
  clave_cliente VARCHAR(255) NOT NULL,
  telefono_cliente VARCHAR(255) NOT NULL,
  correo_cliente VARCHAR(255) NOT NULL,
  nombre_cliente VARCHAR(255) NOT NULL,
  apellido_cliente VARCHAR(255) NOT NULL,
  estado_cliente BOOLEAN DEFAULT TRUE NOT NULL,
  pin_cliente VARCHAR(6) NOT NULL DEFAULT '000000',
  fecha_cliente TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  intentos_cliente INT UNSIGNED DEFAULT 0,
  fecha_reactivacion TIMESTAMP NULL DEFAULT NULL,
  ultimo_intento TIMESTAMP NULL DEFAULT NULL,
    ultimo_cambio_clave TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY (id_cliente),
  CONSTRAINT usuario_unique UNIQUE (usuario_cliente),
  CONSTRAINT telefono_unique UNIQUE (telefono_cliente),
  CONSTRAINT correo_unique UNIQUE (correo_cliente)
);

CREATE TABLE tb_tipo_items(
  id_tipo_item INT UNSIGNED,
  descripcion_tipo_item VARCHAR(255) NOT NULL,
  estado_tipo_item BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (id_tipo_item)
);

CREATE TABLE tb_items(
  id_item INT UNSIGNED,
  id_tipo_item INT UNSIGNED ,
  descripcion_item VARCHAR(255) NOT NULL,
  estado_item BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (id_item),
  CONSTRAINT fk_item_tipo 
  FOREIGN KEY(id_tipo_item) REFERENCES tb_tipo_items(id_tipo_item)
);
CREATE TABLE tb_productos(
  id_producto INT UNSIGNED,
  tipo_producto ENUM('Conjunto','Complementario') NOT NULL,
  descripcion_producto VARCHAR(255) NOT NULL,
  horario_producto ENUM('Desayuno','Almuerzo','Cena','Típico','Todo el día','Desayuno y Almuerzo',
  'Desayuno y Cena','Almuerzo y Cena','Típico y Desayuno','Típico y Almuerzo','Tipico y Cena') NOT NULL,
  precio_producto DECIMAL(10, 2) UNSIGNED NOT NULL,
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
    estado_pedido enum('No escogido','Pendiente','Finalizado') NOT NULL,
    PRIMARY KEY (id_pedido),
    CONSTRAINT fk_pedido_cliente 
    FOREIGN KEY(id_cliente) REFERENCES tb_clientes(id_cliente) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE tb_detalle_pedidos (
  id_detalle_pedido INT UNSIGNED ,
  id_pedido INT UNSIGNED NOT NULL,
  id_producto INT UNSIGNED NOT NULL,
  cantidad_pedido INT UNSIGNED NOT NULL,                                                   
  nota_pedido LONGTEXT,
  PRIMARY KEY (id_detalle_pedido),
  FOREIGN KEY (id_pedido) REFERENCES tb_pedidos(id_pedido) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_producto) REFERENCES tb_productos(id_producto) ON DELETE CASCADE ON UPDATE CASCADE
);

DELIMITER //
CREATE TRIGGER before_insert_tb_detalle_pedidos
BEFORE INSERT ON tb_detalle_pedidos
FOR EACH ROW
BEGIN
  IF NEW.nota_pedido IS NULL OR NEW.nota_pedido = '' THEN
    SET NEW.nota_pedido = 'Nota vacía';
  END IF;
END; //
DELIMITER ;





