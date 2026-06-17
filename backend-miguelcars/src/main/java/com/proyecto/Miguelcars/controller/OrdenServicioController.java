package com.proyecto.Miguelcars.controller;

import com.proyecto.Miguelcars.modelo.OrdenServicio;
import com.proyecto.Miguelcars.service.OrdenServicioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ordenes")
public class OrdenServicioController {

    @Autowired
    private OrdenServicioService ordenServicioService;

    /** GET /api/ordenes — lista todas */
    @GetMapping
    public List<OrdenServicio> listar() {
        return ordenServicioService.listar();
    }

    /** GET /api/ordenes/pendientes — órdenes pendientes de facturación */
    @GetMapping("/pendientes")
    public List<OrdenServicio> listarSinFactura() {
        return ordenServicioService.listarSinFactura();
    }

    /** GET /api/ordenes/{id} — solo acepta números */
    @GetMapping("/{id:[0-9]+}")
    public ResponseEntity<?> buscarPorId(@PathVariable Integer id) {
        return ordenServicioService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** GET /api/ordenes/historial/{placa} — historial de un vehículo */
    @GetMapping("/historial/{placa}")
    public List<OrdenServicio> historialPorPlaca(@PathVariable String placa) {
        return ordenServicioService.buscarPorPlaca(placa);
    }

    /** POST /api/ordenes — crea orden (auto-genera numeroOrden) */
    @PostMapping
    public ResponseEntity<OrdenServicio> crear(@RequestBody OrdenServicio orden) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ordenServicioService.guardar(orden));
    }

    /** PUT /api/ordenes/{id} */
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @RequestBody OrdenServicio orden) {
        orden.setId(id);
        return ResponseEntity.ok(ordenServicioService.guardar(orden));
    }

    /** Recalcula totales — soporta PUT y POST para evitar 405 en el frontend */
    @RequestMapping(value = "/{id}/recalcular", method = {RequestMethod.PUT, RequestMethod.POST})
    public ResponseEntity<?> recalcular(@PathVariable Integer id) {
        return ordenServicioService.buscarPorId(id)
                .map(o -> ResponseEntity.ok(ordenServicioService.recalcularTotales(o)))
                .orElse(ResponseEntity.notFound().build());
    }

    /** DELETE /api/ordenes/{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        ordenServicioService.eliminar(id);
        return ResponseEntity.ok("Orden eliminada");
    }
}
