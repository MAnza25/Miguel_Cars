package com.proyecto.Miguelcars.service;

import com.proyecto.Miguelcars.modelo.Repuesto;
import com.proyecto.Miguelcars.repository.RepuestoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class RepuestoService {

    @Autowired
    private RepuestoRepository repuestoRepository;

    public List<Repuesto> listar() {
        return repuestoRepository.findAll();
    }

    public Optional<Repuesto> buscarPorId(Integer id) {
        return repuestoRepository.findById(id);
    }

    public Repuesto guardar(Repuesto repuesto) {
        return repuestoRepository.save(repuesto);
    }

    public void eliminar(Integer id) {
        repuestoRepository.deleteById(id);
    }
}
