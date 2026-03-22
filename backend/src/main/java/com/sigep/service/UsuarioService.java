package com.sigep.service;

import com.sigep.dto.UsuarioDTO;
import com.sigep.dto.VehiculoDTO;
import com.sigep.entity.Usuario;
import com.sigep.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UsuarioDTO.Response crear(UsuarioDTO.Request req) {
        if (usuarioRepository.existsByEmail(req.getEmail()))
            throw new IllegalArgumentException("El email ya está registrado");
        if (usuarioRepository.existsByDocumento(req.getDocumento()))
            throw new IllegalArgumentException("El documento ya está registrado");

        Usuario usuario = Usuario.builder()
                .nombre(req.getNombre())
                .apellido(req.getApellido())
                .documento(req.getDocumento())
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .matricula(req.getMatricula())
                .telefono(req.getTelefono())
                .tipoUsuario(req.getTipoUsuario())
                .rol(req.getRol())
                .activo(true)
                .build();

        return toResponse(usuarioRepository.save(usuario));
    }

    public List<UsuarioDTO.Response> listar() {
        return usuarioRepository.findByActivoTrue()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public UsuarioDTO.Response obtener(Long id) {
        return toResponse(findOrThrow(id));
    }

    @Transactional
    public UsuarioDTO.Response actualizar(Long id, UsuarioDTO.UpdateRequest req) {
        Usuario u = findOrThrow(id);
        if (req.getNombre()     != null) u.setNombre(req.getNombre());
        if (req.getApellido()   != null) u.setApellido(req.getApellido());
        if (req.getTelefono()   != null) u.setTelefono(req.getTelefono());
        if (req.getMatricula()  != null) u.setMatricula(req.getMatricula());
        if (req.getTipoUsuario()!= null) u.setTipoUsuario(req.getTipoUsuario());
        if (req.getRol()        != null) u.setRol(req.getRol());
        return toResponse(usuarioRepository.save(u));
    }

    @Transactional
    public void bajaLogica(Long id) {
        Usuario u = findOrThrow(id);
        u.setActivo(false);
        usuarioRepository.save(u);
    }

    public List<UsuarioDTO.Response> buscar(String query) {
        return usuarioRepository.buscar(query)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private Usuario findOrThrow(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado: " + id));
    }

    public UsuarioDTO.Response toResponse(Usuario u) {
        List<VehiculoDTO.Response> vehiculos = u.getVehiculos() == null ? List.of() :
                u.getVehiculos().stream()
                        .filter(v -> v.isActivo())
                        .map(v -> VehiculoDTO.Response.builder()
                                .id(v.getId()).patente(v.getPatente())
                                .marca(v.getMarca()).modelo(v.getModelo())
                                .color(v.getColor()).activo(v.isActivo())
                                .creadoEn(v.getCreadoEn()).usuarioId(u.getId())
                                .build())
                        .collect(Collectors.toList());

        return UsuarioDTO.Response.builder()
                .id(u.getId()).nombre(u.getNombre()).apellido(u.getApellido())
                .documento(u.getDocumento()).email(u.getEmail())
                .matricula(u.getMatricula()).telefono(u.getTelefono())
                .tipoUsuario(u.getTipoUsuario()).rol(u.getRol())
                .activo(u.isActivo()).creadoEn(u.getCreadoEn())
                .vehiculos(vehiculos)
                .build();
    }
}
