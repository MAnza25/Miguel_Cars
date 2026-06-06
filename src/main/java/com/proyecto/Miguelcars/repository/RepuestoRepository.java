package com.proyecto.Miguelcars.repository;

import com.proyecto.Miguelcars.modelo.Repuesto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RepuestoRepository extends JpaRepository<Repuesto, Integer> {
}
