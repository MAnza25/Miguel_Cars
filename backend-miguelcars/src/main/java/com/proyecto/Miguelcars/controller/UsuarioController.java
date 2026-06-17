package com.proyecto.Miguelcars.controller;

import com.proyecto.Miguelcars.modelo.LoginRequest;
import com.proyecto.Miguelcars.modelo.Usuario;
import com.proyecto.Miguelcars.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Usuario usuario = usuarioService.login(loginRequest.getUsuario(), loginRequest.getPassword());
        if (usuario != null) {
            return ResponseEntity.ok(usuario);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario o contraseña incorrectos");
        }
    }

    @GetMapping
    public List<Usuario> listar() {
        return usuarioService.listar();
    }

    @GetMapping("/{id}")
    public Optional<Usuario> buscarPorId(@PathVariable Integer id) {
        return usuarioService.buscarPorId(id);
    }

    @GetMapping("/nombre/{usuario}")
    public Usuario buscarPorUsuario(@PathVariable String usuario) {
        return usuarioService.buscarPorUsuario(usuario);
    }

    @PostMapping
    public Usuario guardar(@RequestBody Usuario usuario) {
        return usuarioService.guardar(usuario);
    }

    @PutMapping("/{id}")
    public Usuario actualizar(@PathVariable Integer id, @RequestBody Usuario usuario) {
        usuario.setId(id);
        return usuarioService.guardar(usuario);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        usuarioService.eliminar(id);
    }
}
