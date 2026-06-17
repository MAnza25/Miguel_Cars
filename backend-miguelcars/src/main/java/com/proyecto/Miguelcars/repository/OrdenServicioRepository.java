package com.proyecto.Miguelcars.repository;

import com.proyecto.Miguelcars.modelo.OrdenServicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrdenServicioRepository extends JpaRepository<OrdenServicio, Integer> {
    /** Historial de un vehículo ordenado por fecha de ingreso desc */
    List<OrdenServicio> findByVehiculoPlacaOrderByFechaIngresoDesc(String placa);

    /** Max ID para generación de número de orden sin duplicados */
    @org.springframework.data.jpa.repository.Query("SELECT MAX(o.id) FROM OrdenServicio o")
    Integer findMaxId();

    /** Último número de orden del año actual para calcular el siguiente correlativo */
    @org.springframework.data.jpa.repository.Query(
        "SELECT MAX(o.numeroOrden) FROM OrdenServicio o WHERE o.numeroOrden LIKE CONCAT('ORD-', :anio, '-%')"
    )
    String findMaxNumeroOrdenDelAnio(@org.springframework.data.repository.query.Param("anio") int anio);

    /** Órdenes que no tienen factura asociada */
    @org.springframework.data.jpa.repository.Query(
        "SELECT o FROM OrdenServicio o WHERE o.id NOT IN (SELECT f.ordenServicio.id FROM Factura f)"
    )
    List<OrdenServicio> findOrdenesSinFactura();
}
