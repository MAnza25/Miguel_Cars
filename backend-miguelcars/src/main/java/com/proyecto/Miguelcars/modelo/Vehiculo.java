package com.proyecto.Miguelcars.modelo;

import jakarta.persistence.*;
import lombok.Data;
import java.time.OffsetDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@Table(name = "vehiculos", schema = "miguel_cars")
public class Vehiculo {

    @Id
    private String placa;

    @JsonIgnoreProperties({"creadoEn","actualizadoEn"})
    @ManyToOne
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;

    private String marca;

    private String modelo;

    private String color;

    private Short anio;

    private Integer kilometraje;

    private Boolean activo;

    @Column(name = "creado_en")
    private OffsetDateTime creadoEn;

    @Column(name = "actualizado_en")
    private OffsetDateTime actualizadoEn;
}
