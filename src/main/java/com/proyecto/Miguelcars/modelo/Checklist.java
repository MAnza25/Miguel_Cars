package com.proyecto.Miguelcars.modelo;

import jakarta.persistence.*;
import lombok.Data;
import java.time.OffsetDateTime;

@Data
@Entity
@Table(name = "checklist", schema = "miguel_cars")
public class Checklist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nivel_combustible")
    private String nivelCombustible;

    private Boolean rayones;

    private Boolean golpes;

    @Column(name = "vidrios_rotos")
    private Boolean vidriosRotos;

    @Column(name = "luces_danadas")
    private Boolean lucesDanadas;

    private String observaciones;

    @Column(name = "kilometraje_entrada")
    private Integer kilometrajeEntrada;

    @Column(name = "registrado_en")
    private OffsetDateTime registradoEn;
}
