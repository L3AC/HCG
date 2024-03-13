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
  CONSTRAINT fk_usuario_rol
  FOREIGN KEY(id_rol) REFERENCES sec_roles(id_rol)
  ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE tb_clientes();

CREATE TABLE tb_tipo_productos();
CREATE TABLE tb_productos();

CREATE TABLE tb_menus();
CREATE TABLE tb_menu_productos();

CREATE TABLE tb_pedidos();
CREATE TABLE tb_detalle_pedidos();
