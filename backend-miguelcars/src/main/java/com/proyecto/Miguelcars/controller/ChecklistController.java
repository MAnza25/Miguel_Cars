package com.proyecto.Miguelcars.controller;

import com.proyecto.Miguelcars.modelo.Checklist;
import com.proyecto.Miguelcars.service.ChecklistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/checklist")
public class ChecklistController {

    @Autowired
    private ChecklistService checklistService;

    @GetMapping
    public List<Checklist> listar() {
        return checklistService.listar();
    }

    @GetMapping("/{id}")
    public Optional<Checklist> buscarPorId(@PathVariable Integer id) {
        return checklistService.buscarPorId(id);
    }

    @PostMapping
    public Checklist guardar(@RequestBody Checklist checklist) {
        return checklistService.guardar(checklist);
    }

    @PutMapping("/{id}")
    public Checklist actualizar(@PathVariable Integer id, @RequestBody Checklist checklist) {
        checklist.setId(id);
        return checklistService.guardar(checklist);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        checklistService.eliminar(id);
    }
}
