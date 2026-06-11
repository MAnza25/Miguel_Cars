package com.proyecto.Miguelcars.service;

import com.proyecto.Miguelcars.modelo.Usuario;
import com.proyecto.Miguelcars.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Usuario> listar() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> buscarPorId(Integer id) {
        return usuarioRepository.findById(id);
    }

    public Usuario buscarPorUsuario(String usuario) {
        return usuarioRepository.findByUsuario(usuario);
    }

    public Usuario guardar(Usuario usuario) {
        if (usuario.getActivo() == null) usuario.setActivo(true);
        if (usuario.getCreadoEn() == null) usuario.setCreadoEn(java.time.OffsetDateTime.now());
        usuario.setActualizadoEn(java.time.OffsetDateTime.now());
        return usuarioRepository.save(usuario);
    }

    public void eliminar(Integer id) {
        usuarioRepository.deleteById(id);
    }
}
