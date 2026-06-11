package com.proyecto.Miguelcars.repository;

import com.proyecto.Miguelcars.modelo.OrdenServicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrdenServicioRepository extends JpaRepository<OrdenServicio, Integer> {
    /** Historial de un vehículo ordenado por fecha de ingreso desc */
    List<OrdenServicio> findByVehiculoPlacaOrderByFechaIngresoDesc(String placa);
}
