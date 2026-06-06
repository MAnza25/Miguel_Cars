package com.proyecto.Miguelcars.controller;

import com.proyecto.Miguelcars.modelo.DetalleRepuesto;
import com.proyecto.Miguelcars.service.DetalleRepuestoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/detalle-repuestos")
public class DetalleRepuestoController {

    @Autowired
    private DetalleRepuestoService detalleRepuestoService;

    @GetMapping
    public List<DetalleRepuesto> listar() {
        return detalleRepuestoService.listar();
    }

    @GetMapping("/{id}")
    public Optional<DetalleRepuesto> buscarPorId(@PathVariable Integer id) {
        return detalleRepuestoService.buscarPorId(id);
    }

    @PostMapping
    public DetalleRepuesto guardar(@RequestBody DetalleRepuesto detalleRepuesto) {
        return detalleRepuestoService.guardar(detalleRepuesto);
    }

    @PutMapping("/{id}")
    public DetalleRepuesto actualizar(@PathVariable Integer id, @RequestBody DetalleRepuesto detalleRepuesto) {
        detalleRepuesto.setId(id);
        return detalleRepuestoService.guardar(detalleRepuesto);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        detalleRepuestoService.eliminar(id);
    }
}
