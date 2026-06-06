package com.proyecto.Miguelcars.modelo;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "detalle_servicio", schema = "miguel_cars")
public class DetalleServicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_orden")
    private OrdenServicio ordenServicio;

    @ManyToOne
    @JoinColumn(name = "id_servicio")
    private Servicio servicio;

    private BigDecimal cantidad;

    @Column(name = "precio_unitario")
    private BigDecimal precioUnitario;

    @Column(name = "subtotal", insertable = false, updatable = false)
    private BigDecimal subtotal;
}
