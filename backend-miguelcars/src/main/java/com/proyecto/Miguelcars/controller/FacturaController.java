package com.proyecto.Miguelcars.controller;

import com.proyecto.Miguelcars.modelo.Factura;
import com.proyecto.Miguelcars.service.FacturaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/facturas")
public class FacturaController {

    @Autowired
    private FacturaService facturaService;

    @GetMapping
    public List<Factura> listar() {
        return facturaService.listar();
    }

    @GetMapping("/{id}")
    public Optional<Factura> buscarPorId(@PathVariable Integer id) {
        return facturaService.buscarPorId(id);
    }

    @PostMapping
    public Factura guardar(@RequestBody Factura factura) {
        return facturaService.guardar(factura);
    }

    @PutMapping("/{id}")
    public Factura actualizar(@PathVariable Integer id, @RequestBody Factura factura) {
        factura.setId(id);
        return facturaService.guardar(factura);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        facturaService.eliminar(id);
    }
}