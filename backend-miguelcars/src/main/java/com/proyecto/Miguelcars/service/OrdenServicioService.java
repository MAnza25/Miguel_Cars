package com.proyecto.Miguelcars.service;

import com.proyecto.Miguelcars.modelo.*;
import com.proyecto.Miguelcars.repository.OrdenServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.Year;
import java.util.List;
import java.util.Optional;

@Service
public class OrdenServicioService {

    @Autowired
    private OrdenServicioRepository ordenServicioRepository;

    public List<OrdenServicio> listar() {
        return ordenServicioRepository.findAll();
    }

    public Optional<OrdenServicio> buscarPorId(Integer id) {
        return ordenServicioRepository.findById(id);
    }

    public List<OrdenServicio> buscarPorPlaca(String placa) {
        return ordenServicioRepository.findByVehiculoPlacaOrderByFechaIngresoDesc(placa);
    }

    /**
     * Crea una nueva orden generando automáticamente el número de orden.
     * Formato: ORD-YYYY-XXXX  (ej: ORD-2026-0042)
     */
    public OrdenServicio guardar(OrdenServicio orden) {
        if (orden.getNumeroOrden() == null || orden.getNumeroOrden().isBlank()) {
            orden.setNumeroOrden(generarNumeroOrden());
        }
        if (orden.getEstado() == null) {
            orden.setEstado(EstadoOrden.PENDIENTE);
        }
        if (orden.getFechaIngreso() == null) {
            orden.setFechaIngreso(OffsetDateTime.now());
        }
        orden.setActualizadoEn(OffsetDateTime.now());
        return ordenServicioRepository.save(orden);
    }

    /**
     * Recalcula los totales de la orden según sus detalles.
     */
    public OrdenServicio recalcularTotales(OrdenServicio orden) {
        BigDecimal totalServicios = BigDecimal.ZERO;
        BigDecimal totalRepuestos = BigDecimal.ZERO;

        if (orden.getDetalles() != null) {
            for (DetalleOrden d : orden.getDetalles()) {
                BigDecimal sub = d.getCantidad().multiply(d.getPrecioUnitario());
                if (d.getTipo() == TipoDetalle.SERVICIO) totalServicios = totalServicios.add(sub);
                else                                      totalRepuestos = totalRepuestos.add(sub);
            }
        }

        orden.setTotalServicios(totalServicios);
        orden.setTotalRepuestos(totalRepuestos);
        orden.setTotalGeneral(totalServicios.add(totalRepuestos));
        orden.setActualizadoEn(OffsetDateTime.now());
        return ordenServicioRepository.save(orden);
    }

    public void eliminar(Integer id) {
        ordenServicioRepository.deleteById(id);
    }

    // ── helpers ──────────────────────────────────────────────
    private String generarNumeroOrden() {
        int anio  = Year.now().getValue();
        long total = ordenServicioRepository.count() + 1;
        return String.format("ORD-%d-%04d", anio, total);
    }
}
