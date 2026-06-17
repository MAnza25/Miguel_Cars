package com.proyecto.Miguelcars.controller;

import com.proyecto.Miguelcars.modelo.DetalleOrden;
import com.proyecto.Miguelcars.modelo.DetalleOrdenRequest;
import com.proyecto.Miguelcars.service.DetalleOrdenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/detalle-orden")
public class DetalleOrdenController {

    @Autowired
    private DetalleOrdenService detalleOrdenService;

    /** GET /api/detalle-orden?ordenId=X */
    @GetMapping
    public List<DetalleOrden> listar(@RequestParam(required = false) Integer ordenId) {
        if (ordenId != null) return detalleOrdenService.listarPorOrden(ordenId);
        return detalleOrdenService.listar();
    }

    /** GET /api/detalle-orden/{id} */
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Integer id) {
        return detalleOrdenService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/detalle-orden
     * Recibe { "ordenId": 5, "tipo": "SERVICIO", "descripcion": "...", "cantidad": 1, "precioUnitario": 45000 }
     */
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody DetalleOrdenRequest req) {
        try {
            DetalleOrden creado = detalleOrdenService.guardarDesdeRequest(req);
            return ResponseEntity.status(HttpStatus.CREATED).body(creado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /** PUT /api/detalle-orden/{id} */
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @RequestBody DetalleOrdenRequest req) {
        try {
            DetalleOrden actualizado = detalleOrdenService.actualizarDesdeRequest(id, req);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /** DELETE /api/detalle-orden/{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        detalleOrdenService.eliminar(id);
        return ResponseEntity.ok("Detalle eliminado");
    }
}
