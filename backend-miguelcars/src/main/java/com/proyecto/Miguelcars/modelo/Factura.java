package com.proyecto.Miguelcars.modelo;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@Table(name = "factura", schema = "miguel_cars")
public class Factura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JsonIgnoreProperties({"detalles","checklist","cliente","vehiculo","usuario"})
    @OneToOne
    @JoinColumn(name = "id_orden")
    private OrdenServicio ordenServicio;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    @Column(name = "numero_factura")
    private String numeroFactura;

    private OffsetDateTime fecha;

    private BigDecimal subtotal;

    private BigDecimal descuento;

    private BigDecimal total;

    @Column(name = "pdf_url")
    private String pdfUrl;

    @Column(name = "enviado_wp")
    private Boolean enviadoWp;
}
