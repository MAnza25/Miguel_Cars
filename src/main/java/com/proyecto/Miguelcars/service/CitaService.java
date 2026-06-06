package com.proyecto.Miguelcars.service;

import com.proyecto.Miguelcars.modelo.Cita;
import com.proyecto.Miguelcars.repository.CitaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CitaService {

    @Autowired
    private CitaRepository citaRepository;

    public List<Cita> listar() {
        return citaRepository.findAll();
    }

    public Optional<Cita> buscarPorId(Integer id) {
        return citaRepository.findById(id);
    }

    public Cita guardar(Cita cita) {
        return citaRepository.save(cita);
    }

    public void eliminar(Integer id) {
        citaRepository.deleteById(id);
    }
}