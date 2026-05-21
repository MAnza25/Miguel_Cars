CREATE DATABASE crud_spring;


USE crud_spring;

CREATE TABLE productos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    precio DOUBLE
);

CREATE TABLE vehiculos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    marca VARCHAR(255),
    modelo VARCHAR(255),
    anio INT,
    precio DOUBLE,
    placa VARCHAR(255),
    color VARCHAR(255)
);