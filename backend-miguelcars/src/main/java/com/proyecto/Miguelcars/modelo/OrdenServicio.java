package com.proyecto.Miguelcars.modelo;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@Table(name = "orden_servicio", schema = "miguel_cars")
public class OrdenServicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "numero_orden", unique = true)
    private String numeroOrden;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "id_checklist")
    private Checklist checklist;

    @JsonIgnoreProperties({"cliente","vehiculos","creadoEn","actualizadoEn"})
    @ManyToOne
    @JoinColumn(name = "placa")
    private Vehiculo vehiculo;

    @JsonIgnoreProperties({"creadoEn","actualizadoEn"})
    @ManyToOne
    @JoinColumn(name = "id_cliente")
    private Cliente cliente;

    @JsonIgnoreProperties({"rol","passwordHash","creadoEn","actualizadoEn"})
    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @Column(name = "motivo_ingreso")
    private String motivoIngreso;

    private String diagnostico;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoOrden estado = EstadoOrden.PENDIENTE;

    @Column(name = "fecha_ingreso")
    private OffsetDateTime fechaIngreso;

    @Column(name = "fecha_entrega")
    private OffsetDateTime fechaEntrega;

    @Column(name = "total_servicios", precision = 10, scale = 2)
    private BigDecimal totalServicios;

    @Column(name = "total_repuestos", precision = 10, scale = 2)
    private BigDecimal totalRepuestos;

    @Column(name = "total_general", precision = 10, scale = 2)
    private BigDecimal totalGeneral;

    @Column(name = "actualizado_en")
    private OffsetDateTime actualizadoEn;

    @JsonIgnore  // evita LazyInitializationException al serializar con open-in-view=false
    @OneToMany(mappedBy = "ordenServicio", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleOrden> detalles;
}
