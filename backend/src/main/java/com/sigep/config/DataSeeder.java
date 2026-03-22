package com.sigep.config;

import com.sigep.entity.Rol;
import com.sigep.entity.TipoUsuario;
import com.sigep.entity.Usuario;
import com.sigep.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (usuarioRepository.existsByEmail("admin@sigep.edu")) return;

        Usuario admin = Usuario.builder()
                .nombre("Admin")
                .apellido("SIGEP")
                .documento("00000001")
                .email("admin@sigep.edu")
                .password(passwordEncoder.encode("admin123"))
                .tipoUsuario(TipoUsuario.DOCENTE)
                .rol(Rol.ADMINISTRADOR)
                .activo(true)
                .build();

        usuarioRepository.save(admin);
        log.info("Usuario admin creado: admin@sigep.edu / admin123");
    }
}
