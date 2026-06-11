package com.proyecto.Miguelcars.service;

import com.proyecto.Miguelcars.modelo.Cliente;
import com.proyecto.Miguelcars.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    public List<Cliente> listar() {
        return clienteRepository.findAll();
    }

    /** Paginación: GET /api/clientes?page=0&size=10 */
    public Page<Cliente> listarPaginado(Pageable pageable) {
        return clienteRepository.findAll(pageable);
    }

    public Optional<Cliente> buscarPorId(Integer id) {
        return clienteRepository.findById(id);
    }

    public Cliente buscarPorCedula(String cedula) {
        return clienteRepository.findByCedula(cedula);
    }

    public Cliente guardar(Cliente cliente) {
        if (cliente.getId() == null && cliente.getActivo() == null) {
            cliente.setActivo(true);
        }
        if (cliente.getCreadoEn() == null) {
            cliente.setCreadoEn(java.time.OffsetDateTime.now());
        }
        cliente.setActualizadoEn(java.time.OffsetDateTime.now());
        return clienteRepository.save(cliente);
    }

    public void eliminar(Integer id) {
        clienteRepository.deleteById(id);
    }
}
