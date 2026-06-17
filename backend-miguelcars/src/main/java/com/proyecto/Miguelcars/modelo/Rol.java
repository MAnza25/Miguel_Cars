package com.proyecto.Miguelcars.modelo;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "roles", schema = "miguel_cars")
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String nombre;

    private String descripcion;

    @Column(columnDefinition = "TEXT")
    private String permisos;
}
