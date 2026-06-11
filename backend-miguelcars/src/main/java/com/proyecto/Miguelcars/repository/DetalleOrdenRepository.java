package com.proyecto.Miguelcars.repository;

import com.proyecto.Miguelcars.modelo.DetalleOrden;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DetalleOrdenRepository extends JpaRepository<DetalleOrden, Integer> {
    List<DetalleOrden> findByOrdenServicioId(Integer idOrden);
}
