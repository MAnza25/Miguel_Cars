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

    public List<OrdenServicio> listarSinFactura() {
        return ordenServicioRepository.findOrdenesSinFactura();
    }

    /**
     * Crea una nueva orden generando automáticamente el número de orden.
     * - fechaIngreso: se asigna automáticamente al momento de creación
     * - fechaEntrega: se asigna automáticamente cuando el estado cambia a ENTREGADA
     */
    public OrdenServicio guardar(OrdenServicio orden) {
        if (orden.getNumeroOrden() == null || orden.getNumeroOrden().isBlank()) {
            orden.setNumeroOrden(generarNumeroOrden());
        }
        if (orden.getEstado() == null) {
            orden.setEstado(EstadoOrden.PENDIENTE);
        }
        // Fecha de ingreso: siempre se asigna al crear (si no viene del cliente)
        if (orden.getFechaIngreso() == null) {
            orden.setFechaIngreso(OffsetDateTime.now());
        }
        // Fecha de entrega: se registra automáticamente cuando se marca como ENTREGADA
        if (EstadoOrden.ENTREGADA.equals(orden.getEstado()) && orden.getFechaEntrega() == null) {
            orden.setFechaEntrega(OffsetDateTime.now());
        }
        orden.setActualizadoEn(OffsetDateTime.now());
        return ordenServicioRepository.save(orden);
    }

    @Autowired
    private com.proyecto.Miguelcars.repository.DetalleOrdenRepository detalleOrdenRepository;

    /**
     * Recalcula los totales de la orden según sus detalles.
     */
    public OrdenServicio recalcularTotales(OrdenServicio orden) {
        BigDecimal totalServicios = BigDecimal.ZERO;
        BigDecimal totalRepuestos = BigDecimal.ZERO;

        // Consultamos los detalles directamente al repositorio para evitar problemas de Lazy Loading
        List<DetalleOrden> detalles = detalleOrdenRepository.findByOrdenServicioId(orden.getId());
        
        if (detalles != null) {
            for (DetalleOrden d : detalles) {
                BigDecimal cant = d.getCantidad() != null ? d.getCantidad() : BigDecimal.ONE;
                BigDecimal prec = d.getPrecioUnitario() != null ? d.getPrecioUnitario() : BigDecimal.ZERO;
                BigDecimal sub = cant.multiply(prec);
                
                if (TipoDetalle.SERVICIO.equals(d.getTipo())) {
                    totalServicios = totalServicios.add(sub);
                } else {
                    totalRepuestos = totalRepuestos.add(sub);
                }
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
        int anio = Year.now().getValue();
        // Busca el último número de orden del año actual para calcular el siguiente
        String maxNumero = ordenServicioRepository.findMaxNumeroOrdenDelAnio(anio);
        long siguiente = 1;
        if (maxNumero != null) {
            try {
                // Formato: ORD-2026-0012 → extraer "0012" → 12 → siguiente: 13
                String[] partes = maxNumero.split("-");
                siguiente = Long.parseLong(partes[partes.length - 1]) + 1;
            } catch (Exception ignored) {
                siguiente = ordenServicioRepository.count() + 1;
            }
        }
        return String.format("ORD-%d-%04d", anio, siguiente);
    }
}
