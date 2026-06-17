package com.proyecto.Miguelcars.service;

import com.proyecto.Miguelcars.modelo.DetalleOrden;
import com.proyecto.Miguelcars.modelo.DetalleOrdenRequest;
import com.proyecto.Miguelcars.modelo.OrdenServicio;
import com.proyecto.Miguelcars.repository.DetalleOrdenRepository;
import com.proyecto.Miguelcars.repository.OrdenServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class DetalleOrdenService {

    @Autowired
    private DetalleOrdenRepository detalleOrdenRepository;

    @Autowired
    private OrdenServicioRepository ordenServicioRepository;

    @Autowired
    private OrdenServicioService ordenServicioService;

    public List<DetalleOrden> listar() {
        return detalleOrdenRepository.findAll();
    }

    public List<DetalleOrden> listarPorOrden(Integer idOrden) {
        return detalleOrdenRepository.findByOrdenServicioId(idOrden);
    }

    public Optional<DetalleOrden> buscarPorId(Integer id) {
        return detalleOrdenRepository.findById(id);
    }

    /**
     * Crea un DetalleOrden desde el DTO DetalleOrdenRequest.
     * Resuelve la OrdenServicio por ID directamente desde el repositorio.
     */
    public DetalleOrden guardarDesdeRequest(DetalleOrdenRequest req) {
        OrdenServicio orden = ordenServicioRepository
                .findById(req.getOrdenId())
                .orElseThrow(() -> new RuntimeException("Orden #" + req.getOrdenId() + " no encontrada"));

        DetalleOrden detalle = new DetalleOrden();
        detalle.setOrdenServicio(orden);
        detalle.setTipo(req.getTipo());
        detalle.setDescripcion(req.getDescripcion());
        detalle.setCantidad(req.getCantidad());
        detalle.setPrecioUnitario(req.getPrecioUnitario());
        
        DetalleOrden guardado = detalleOrdenRepository.save(detalle);
        
        // IMPORTANTE: Recalcular la orden inmediatamente
        ordenServicioService.recalcularTotales(orden);
        
        return guardado;
    }

    /**
     * Actualiza un DetalleOrden existente.
     */
    public DetalleOrden actualizarDesdeRequest(Integer id, DetalleOrdenRequest req) {
        DetalleOrden detalle = detalleOrdenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Detalle #" + id + " no encontrado"));

        if (req.getOrdenId() != null) {
            OrdenServicio orden = ordenServicioRepository
                    .findById(req.getOrdenId())
                    .orElseThrow(() -> new RuntimeException("Orden #" + req.getOrdenId() + " no encontrada"));
            detalle.setOrdenServicio(orden);
        }
        if (req.getTipo() != null)           detalle.setTipo(req.getTipo());
        if (req.getDescripcion() != null)     detalle.setDescripcion(req.getDescripcion());
        if (req.getCantidad() != null)        detalle.setCantidad(req.getCantidad());
        if (req.getPrecioUnitario() != null)  detalle.setPrecioUnitario(req.getPrecioUnitario());
        return detalleOrdenRepository.save(detalle);
    }

    public void eliminar(Integer id) {
        detalleOrdenRepository.deleteById(id);
    }
}
