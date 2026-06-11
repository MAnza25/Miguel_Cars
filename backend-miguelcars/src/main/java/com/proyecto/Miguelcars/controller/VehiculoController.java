package com.proyecto.Miguelcars.controller;

import com.proyecto.Miguelcars.modelo.Vehiculo;
import com.proyecto.Miguelcars.service.VehiculoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/vehiculos")
public class VehiculoController {

    @Autowired
    private VehiculoService vehiculoService;

    @GetMapping
    public List<Vehiculo> listar() {
        return vehiculoService.listar();
    }

    @GetMapping("/{placa}")
    public Optional<Vehiculo> buscarPorPlaca(@PathVariable String placa) {
        return vehiculoService.buscarPorPlaca(placa);
    }

    @PostMapping
    public Vehiculo guardar(@RequestBody Vehiculo vehiculo) {
        return vehiculoService.guardar(vehiculo);
    }

    @PutMapping("/{placa}")
    public Vehiculo actualizar(@PathVariable String placa, @RequestBody Vehiculo vehiculo) {
        vehiculo.setPlaca(placa);
        return vehiculoService.guardar(vehiculo);
    }

    @DeleteMapping("/{placa}")
    public void eliminar(@PathVariable String placa) {
        vehiculoService.eliminar(placa);
    }
}
