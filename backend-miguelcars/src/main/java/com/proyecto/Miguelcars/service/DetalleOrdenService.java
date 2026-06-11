package com.proyecto.Miguelcars.service;

import com.proyecto.Miguelcars.modelo.DetalleOrden;
import com.proyecto.Miguelcars.repository.DetalleOrdenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class DetalleOrdenService {

    @Autowired
    private DetalleOrdenRepository detalleOrdenRepository;

    public List<DetalleOrden> listar() {
        return detalleOrdenRepository.findAll();
    }

    public List<DetalleOrden> listarPorOrden(Integer idOrden) {
        return detalleOrdenRepository.findByOrdenServicioId(idOrden);
    }

    public Optional<DetalleOrden> buscarPorId(Integer id) {
        return detalleOrdenRepository.findById(id);
    }

    public DetalleOrden guardar(DetalleOrden detalle) {
        return detalleOrdenRepository.save(detalle);
    }

    public void eliminar(Integer id) {
        detalleOrdenRepository.deleteById(id);
    }
}
