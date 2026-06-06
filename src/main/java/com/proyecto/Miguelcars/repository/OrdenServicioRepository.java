package com.proyecto.Miguelcars.repository;

import com.proyecto.Miguelcars.modelo.OrdenServicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrdenServicioRepository extends JpaRepository<OrdenServicio, Integer> {
}
