package com.proyecto.Miguelcars.service;

import com.proyecto.Miguelcars.modelo.DetalleServicio;
import com.proyecto.Miguelcars.repository.DetalleServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class DetalleServicioService {

    @Autowired
    private DetalleServicioRepository detalleServicioRepository;

    public List<DetalleServicio> listar() {
        return detalleServicioRepository.findAll();
    }

    public Optional<DetalleServicio> buscarPorId(Integer id) {
        return detalleServicioRepository.findById(id);
    }

    public DetalleServicio guardar(DetalleServicio detalleServicio) {
        return detalleServicioRepository.save(detalleServicio);
    }

    public void eliminar(Integer id) {
        detalleServicioRepository.deleteById(id);
    }
}
