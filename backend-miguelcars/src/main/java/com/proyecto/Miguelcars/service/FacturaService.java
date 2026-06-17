package com.proyecto.Miguelcars.service;

import com.proyecto.Miguelcars.modelo.*;
import com.proyecto.Miguelcars.repository.FacturaRepository;
import com.proyecto.Miguelcars.repository.OrdenServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.Year;
import java.util.List;
import java.util.Optional;

@Service
public class FacturaService {

    @Autowired
    private FacturaRepository facturaRepository;

    @Autowired
    private OrdenServicioRepository ordenServicioRepository;

    public List<Factura> listar() {
        return facturaRepository.findAll();
    }

    /**
     * Lista las órdenes de servicio que aún no han sido facturadas.
     * Filtra manualmente para asegurar compatibilidad total.
     */
    public List<OrdenServicio> listarOrdenesSinFactura() {
        List<OrdenServicio> todas = ordenServicioRepository.findAll();
        List<Factura> facturas = facturaRepository.findAll();
        
        // Obtenemos los IDs de las órdenes que ya tienen factura
        List<Integer> idsFacturados = facturas.stream()
                .filter(f -> f.getOrdenServicio() != null)
                .map(f -> f.getOrdenServicio().getId())
                .collect(java.util.stream.Collectors.toList());
        
        // Retornamos las que NO están en esa lista
        return todas.stream()
                .filter(o -> !idsFacturados.contains(o.getId()))
                .collect(java.util.stream.Collectors.toList());
    }

    public Optional<Factura> buscarPorId(Integer id) {
        return facturaRepository.findById(id);
    }

    public Factura guardar(Factura factura) {
        return facturaRepository.save(factura);
    }

    public void eliminar(Integer id) {
        facturaRepository.deleteById(id);
    }

    /**
     * Genera una factura automáticamente desde una orden de servicio.
     */
    public Factura generarDesdeOrden(Integer ordenId, BigDecimal descuento) {
        OrdenServicio orden = ordenServicioRepository.findById(ordenId)
                .orElseThrow(() -> new RuntimeException("Orden #" + ordenId + " no encontrada"));

        // Verificar que no tenga factura previa
        if (facturaRepository.findByOrdenServicioId(ordenId).isPresent()) {
            throw new RuntimeException("La orden #" + orden.getNumeroOrden() + " ya tiene una factura generada");
        }

        // Marcar orden como ENTREGADA y registrar fecha de entrega
        orden.setEstado(EstadoOrden.ENTREGADA);
        orden.setFechaEntrega(OffsetDateTime.now());
        orden.setActualizadoEn(OffsetDateTime.now());
        ordenServicioRepository.save(orden);

        // Crear factura
        Factura factura = new Factura();
        factura.setOrdenServicio(orden);
        factura.setNumeroFactura(generarNumeroFactura());
        factura.setFecha(OffsetDateTime.now());

        BigDecimal subtotal = orden.getTotalGeneral() != null ? orden.getTotalGeneral() : BigDecimal.ZERO;
        BigDecimal desc = descuento != null ? descuento : BigDecimal.ZERO;
        
        factura.setSubtotal(subtotal);
        factura.setDescuento(desc);
        factura.setTotal(subtotal.subtract(desc));
        factura.setEnviadoWp(false);

        return facturaRepository.save(factura);
    }

    private String generarNumeroFactura() {
        int anio = Year.now().getValue();
        long total = facturaRepository.count() + 1;
        return String.format("FAC-%d-%04d", anio, total);
    }
}
