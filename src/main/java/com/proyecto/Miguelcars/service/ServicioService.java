package com.proyecto.Miguelcars.service;

import com.proyecto.Miguelcars.modelo.Servicio;
import com.proyecto.Miguelcars.repository.ServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ServicioService {

    @Autowired
    private ServicioRepository servicioRepository;

    public List<Servicio> listar() {
        return servicioRepository.findAll();
    }

    public Optional<Servicio> buscarPorId(Integer id) {
        return servicioRepository.findById(id);
    }

    public Servicio guardar(Servicio servicio) {
        return servicioRepository.save(servicio);
    }

    public void eliminar(Integer id) {
        servicioRepository.deleteById(id);
    }
}
