package com.proyecto.Miguelcars.repository;

import com.proyecto.Miguelcars.modelo.Factura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface FacturaRepository extends JpaRepository<Factura, Integer> {
    Optional<Factura> findByOrdenServicioId(Integer ordenId);
}
