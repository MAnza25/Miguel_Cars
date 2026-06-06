package com.proyecto.Miguelcars.controller;

import com.proyecto.Miguelcars.modelo.Servicio;
import com.proyecto.Miguelcars.service.ServicioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/servicios")
public class ServicioController {

    @Autowired
    private ServicioService servicioService;

    @GetMapping
    public List<Servicio> listar() {
        return servicioService.listar();
    }

    @GetMapping("/{id}")
    public Optional<Servicio> buscarPorId(@PathVariable Integer id) {
        return servicioService.buscarPorId(id);
    }

    @PostMapping
    public Servicio guardar(@RequestBody Servicio servicio) {
        return servicioService.guardar(servicio);
    }

    @PutMapping("/{id}")
    public Servicio actualizar(@PathVariable Integer id, @RequestBody Servicio servicio) {
        servicio.setId(id);
        return servicioService.guardar(servicio);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        servicioService.eliminar(id);
    }
}