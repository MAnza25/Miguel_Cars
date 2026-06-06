package com.proyecto.Miguelcars.controller;

import com.proyecto.Miguelcars.modelo.OrdenServicio;
import com.proyecto.Miguelcars.service.OrdenServicioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/ordenes")
public class OrdenServicioController {

    @Autowired
    private OrdenServicioService ordenServicioService;

    @GetMapping
    public List<OrdenServicio> listar() {
        return ordenServicioService.listar();
    }

    @GetMapping("/{id}")
    public Optional<OrdenServicio> buscarPorId(@PathVariable Integer id) {
        return ordenServicioService.buscarPorId(id);
    }

    @PostMapping
    public OrdenServicio guardar(@RequestBody OrdenServicio ordenServicio) {
        return ordenServicioService.guardar(ordenServicio);
    }

    @PutMapping("/{id}")
    public OrdenServicio actualizar(@PathVariable Integer id, @RequestBody OrdenServicio ordenServicio) {
        ordenServicio.setId(id);
        return ordenServicioService.guardar(ordenServicio);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        ordenServicioService.eliminar(id);
    }
}
