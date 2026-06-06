package com.proyecto.Miguelcars.service;

import com.proyecto.Miguelcars.modelo.OrdenServicio;
import com.proyecto.Miguelcars.repository.OrdenServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class OrdenServicioService {

    @Autowired
    private OrdenServicioRepository ordenServicioRepository;

    public List<OrdenServicio> listar() {
        return ordenServicioRepository.findAll();
    }

    public Optional<OrdenServicio> buscarPorId(Integer id) {
        return ordenServicioRepository.findById(id);
    }

    public OrdenServicio guardar(OrdenServicio ordenServicio) {
        return ordenServicioRepository.save(ordenServicio);
    }

    public void eliminar(Integer id) {
        ordenServicioRepository.deleteById(id);
    }
}