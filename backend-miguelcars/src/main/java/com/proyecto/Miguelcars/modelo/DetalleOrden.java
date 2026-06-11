package com.proyecto.Miguelcars.modelo;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
@Table(name = "detalle_orden", schema = "miguel_cars")
public class DetalleOrden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JsonIgnore  // evita referencia circular DetalleOrden → OrdenServicio → DetalleOrden
    @ManyToOne
    @JoinColumn(name = "id_orden", nullable = false)
    private OrdenServicio ordenServicio;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoDetalle tipo;  // SERVICIO o REPUESTO

    @Column(nullable = false)
    private String descripcion;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal cantidad;

    @Column(name = "precio_unitario", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioUnitario;

    // subtotal calculado = cantidad * precioUnitario
    @Column(name = "subtotal", precision = 10, scale = 2,
            insertable = false, updatable = false)
    private BigDecimal subtotal;
}
