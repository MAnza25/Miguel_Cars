package com.proyecto.Miguelcars.controller;

import com.proyecto.Miguelcars.modelo.DetalleServicio;
import com.proyecto.Miguelcars.service.DetalleServicioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/detalle-servicios")
public class DetalleServicioController {

    @Autowired
    private DetalleServicioService detalleServicioService;

    @GetMapping
    public List<DetalleServicio> listar() {
        return detalleServicioService.listar();
    }

    @GetMapping("/{id}")
    public Optional<DetalleServicio> buscarPorId(@PathVariable Integer id) {
        return detalleServicioService.buscarPorId(id);
    }

    @PostMapping
    public DetalleServicio guardar(@RequestBody DetalleServicio detalleServicio) {
        return detalleServicioService.guardar(detalleServicio);
    }

    @PutMapping("/{id}")
    public DetalleServicio actualizar(@PathVariable Integer id, @RequestBody DetalleServicio detalleServicio) {
        detalleServicio.setId(id);
        return detalleServicioService.guardar(detalleServicio);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        detalleServicioService.eliminar(id);
    }
  
}
