package com.proyecto.Miguelcars.modelo;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
@Entity
@Table(name = "orden_servicio", schema = "miguel_cars")
public class OrdenServicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "id_checklist")
    private Checklist checklist;

    @ManyToOne
    @JoinColumn(name = "placa")
    private Vehiculo vehiculo;

    @ManyToOne
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @Column(name = "fecha_ingreso")
    private OffsetDateTime fechaIngreso;

    @Column(name = "fecha_entrega")
    private OffsetDateTime fechaEntrega;

    private String diagnostico;

    @Enumerated(EnumType.STRING)
    private EstadoOrden estado;

    private BigDecimal total;

    @Column(name = "actualizado_en")
    private OffsetDateTime actualizadoEn;
}