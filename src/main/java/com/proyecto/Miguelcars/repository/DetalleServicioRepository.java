package com.proyecto.Miguelcars.repository;

import com.proyecto.Miguelcars.modelo.DetalleServicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetalleServicioRepository extends JpaRepository<DetalleServicio, Integer> {
}
