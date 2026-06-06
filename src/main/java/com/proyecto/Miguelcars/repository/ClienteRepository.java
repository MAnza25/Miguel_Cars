package com.proyecto.Miguelcars.repository;

import com.proyecto.Miguelcars.modelo.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer> {
    Cliente findByCedula(String cedula);
}
