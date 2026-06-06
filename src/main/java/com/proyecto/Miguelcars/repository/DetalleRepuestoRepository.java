package com.proyecto.Miguelcars.repository;

import com.proyecto.Miguelcars.modelo.DetalleRepuesto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetalleRepuestoRepository extends JpaRepository<DetalleRepuesto, Integer> {
}
