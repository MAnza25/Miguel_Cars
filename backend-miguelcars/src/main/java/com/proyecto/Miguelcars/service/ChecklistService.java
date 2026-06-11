package com.proyecto.Miguelcars.service;

import com.proyecto.Miguelcars.modelo.Checklist;
import com.proyecto.Miguelcars.repository.ChecklistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ChecklistService {

    @Autowired
    private ChecklistRepository checklistRepository;

    public List<Checklist> listar() {
        return checklistRepository.findAll();
    }

    public Optional<Checklist> buscarPorId(Integer id) {
        return checklistRepository.findById(id);
    }

    public Checklist guardar(Checklist checklist) {
        return checklistRepository.save(checklist);
    }

    public void eliminar(Integer id) {
        checklistRepository.deleteById(id);
    }
}
