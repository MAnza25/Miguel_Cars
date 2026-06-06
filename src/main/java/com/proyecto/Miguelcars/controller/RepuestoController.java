package com.proyecto.Miguelcars.controller;

import com.proyecto.Miguelcars.modelo.Repuesto;
import com.proyecto.Miguelcars.service.RepuestoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/repuestos")
public class RepuestoController {

    @Autowired
    private RepuestoService repuestoService;

    @GetMapping
    public List<Repuesto> listar() {
        return repuestoService.listar();
    }

    @GetMapping("/{id}")
    public Optional<Repuesto> buscarPorId(@PathVariable Integer id) {
        return repuestoService.buscarPorId(id);
    }

    @PostMapping
    public Repuesto guardar(@RequestBody Repuesto repuesto) {
        return repuestoService.guardar(repuesto);
    }

    @PutMapping("/{id}")
    public Repuesto actualizar(@PathVariable Integer id, @RequestBody Repuesto repuesto) {
        repuesto.setId(id);
        return repuestoService.guardar(repuesto);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        repuestoService.eliminar(id);
    }
}