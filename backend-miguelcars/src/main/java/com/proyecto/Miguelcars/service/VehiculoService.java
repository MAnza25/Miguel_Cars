package com.proyecto.Miguelcars.service;

import com.proyecto.Miguelcars.modelo.Vehiculo;
import com.proyecto.Miguelcars.repository.VehiculoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class VehiculoService {

    @Autowired
    private VehiculoRepository vehiculoRepository;

    public List<Vehiculo> listar() {
        return vehiculoRepository.findAll();
    }

    public Optional<Vehiculo> buscarPorPlaca(String placa) {
        return vehiculoRepository.findById(placa);
    }

    public Vehiculo guardar(Vehiculo vehiculo) {
        if (vehiculo.getActivo() == null) vehiculo.setActivo(true);
        if (vehiculo.getCreadoEn() == null) vehiculo.setCreadoEn(java.time.OffsetDateTime.now());
        vehiculo.setActualizadoEn(java.time.OffsetDateTime.now());
        return vehiculoRepository.save(vehiculo);
    }

    public void eliminar(String placa) {
        vehiculoRepository.deleteById(placa);
    }
}
