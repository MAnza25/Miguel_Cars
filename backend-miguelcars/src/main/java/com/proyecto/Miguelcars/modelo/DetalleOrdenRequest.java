package com.proyecto.Miguelcars.modelo;

import java.math.BigDecimal;

/**
 * DTO para recibir la creación de un detalle de orden.
 * Usa ordenId como Integer plano en vez de objeto anidado,
 * evitando el problema de @JsonIgnore en DetalleOrden.ordenServicio.
 */
public class DetalleOrdenRequest {
    private Integer ordenId;
    private TipoDetalle tipo;
    private String descripcion;
    private BigDecimal cantidad;
    private BigDecimal precioUnitario;

    public Integer getOrdenId()          { return ordenId; }
    public void setOrdenId(Integer v)    { this.ordenId = v; }
    public TipoDetalle getTipo()         { return tipo; }
    public void setTipo(TipoDetalle v)   { this.tipo = v; }
    public String getDescripcion()       { return descripcion; }
    public void setDescripcion(String v) { this.descripcion = v; }
    public BigDecimal getCantidad()      { return cantidad; }
    public void setCantidad(BigDecimal v){ this.cantidad = v; }
    public BigDecimal getPrecioUnitario()         { return precioUnitario; }
    public void setPrecioUnitario(BigDecimal v)   { this.precioUnitario = v; }
}
