package com.proyecto.Miguelcars.controller;

import com.proyecto.Miguelcars.modelo.Factura;
import com.proyecto.Miguelcars.service.FacturaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("/ordenes-pendientes")
    public List<com.proyecto.Miguelcars.modelo.OrdenServicio> listarPendientes() {
        return facturaService.listarOrdenesSinFactura();
    }

    @PostMapping
    public ResponseEntity<Factura> guardar(@RequestBody Factura factura) {
        return ResponseEntity.status(HttpStatus.CREATED).body(facturaService.guardar(factura));
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

    /**
     * POST /api/facturas/desde-orden/{ordenId}
     * Genera una factura automáticamente desde una orden de servicio.
     */
    @PostMapping("/desde-orden/{ordenId}")
    public ResponseEntity<?> generarDesdeOrden(
            @PathVariable Integer ordenId, 
            @RequestParam(required = false) java.math.BigDecimal descuento) {
        try {
            Factura factura = facturaService.generarDesdeOrden(ordenId, descuento);
            return ResponseEntity.status(HttpStatus.CREATED).body(factura);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
