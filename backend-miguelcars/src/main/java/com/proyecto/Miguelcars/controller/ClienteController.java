package com.proyecto.Miguelcars.controller;

import com.proyecto.Miguelcars.modelo.Cliente;
import com.proyecto.Miguelcars.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    /**
     * GET /api/clientes              → lista todos (sin paginación, compatible con frontend)
     * GET /api/clientes?page=0&size=10 → lista paginada
     */
    @GetMapping
    public Object listar(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size) {

        if (page != null) {
            // Paginado: retorna Page<Cliente> con metadata (total, páginas, etc.)
            return clienteService.listarPaginado(PageRequest.of(page, size, Sort.by("nombre")));
        }
        // Sin paginación: retorna List<Cliente> para compatibilidad con el frontend actual
        return clienteService.listar();
    }

    @GetMapping("/{id}")
    public Optional<Cliente> buscarPorId(@PathVariable Integer id) {
        return clienteService.buscarPorId(id);
    }

    @GetMapping("/cedula/{cedula}")
    public Cliente buscarPorCedula(@PathVariable String cedula) {
        return clienteService.buscarPorCedula(cedula);
    }

    @PostMapping
    public Cliente guardar(@RequestBody Cliente cliente) {
        return clienteService.guardar(cliente);
    }

    @PutMapping("/{id}")
    public Cliente actualizar(@PathVariable Integer id, @RequestBody Cliente cliente) {
        cliente.setId(id);
        return clienteService.guardar(cliente);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        clienteService.eliminar(id);
    }
}
