package com.proyecto.Miguelcars.modelo;

import jakarta.persistence.*;
import lombok.Data;
import java.time.OffsetDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@Table(name = "usuarios", schema = "miguel_cars")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JsonIgnoreProperties({"descripcion"})
    @ManyToOne
    @JoinColumn(name = "rol_id")
    private Rol rol;

    private String nombre;

    private String usuario;

    @Column(name = "password_hash")
    private String passwordHash;

    private Boolean activo;

    @Column(name = "creado_en")
    private OffsetDateTime creadoEn;

    @Column(name = "actualizado_en")
    private OffsetDateTime actualizadoEn;
}
