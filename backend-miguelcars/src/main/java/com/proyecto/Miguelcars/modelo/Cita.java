package com.proyecto.Miguelcars.modelo;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@Table(name = "citas", schema = "miguel_cars")
public class Cita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "placa")
    private Vehiculo vehiculo;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    // Evitar serializar toda la orden (ciclos) — solo expone el id
    @JsonIgnoreProperties({"detalles","checklist","cliente","vehiculo","usuario","citas"})
    @ManyToOne
    @JoinColumn(name = "id_orden")
    private OrdenServicio ordenServicio;

    private LocalDate fecha;

    private LocalTime hora;

    private String motivo;

    @Enumerated(EnumType.STRING)
    private EstadoCita estado;

    private String observaciones;

    @Column(name = "creado_en")
    private OffsetDateTime creadoEn;

    @Column(name = "actualizado_en")
    private OffsetDateTime actualizadoEn;
}
