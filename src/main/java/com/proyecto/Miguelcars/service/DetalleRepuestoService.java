package com.proyecto.Miguelcars.service;

import com.proyecto.Miguelcars.modelo.DetalleRepuesto;
import com.proyecto.Miguelcars.repository.DetalleRepuestoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class DetalleRepuestoService {

    @Autowired
    private DetalleRepuestoRepository detalleRepuestoRepository;

    public List<DetalleRepuesto> listar() {
        return detalleRepuestoRepository.findAll();
    }

    public Optional<DetalleRepuesto> buscarPorId(Integer id) {
        return detalleRepuestoRepository.findById(id);
    }

    public DetalleRepuesto guardar(DetalleRepuesto detalleRepuesto) {
        return detalleRepuestoRepository.save(detalleRepuesto);
    }

    public void eliminar(Integer id) {
        detalleRepuestoRepository.deleteById(id);
    }
}
