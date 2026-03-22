package com.sigep.service;

import com.sigep.dto.VehiculoDTO;
import com.sigep.entity.Usuario;
import com.sigep.entity.Vehiculo;
import com.sigep.repository.UsuarioRepository;
import com.sigep.repository.VehiculoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehiculoService {

    private final VehiculoRepository vehiculoRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public VehiculoDTO.Response registrar(VehiculoDTO.Request req) {
        if (vehiculoRepository.existsByPatente(req.getPatente()))
            throw new IllegalArgumentException("La patente ya está registrada");

        Usuario usuario = usuarioRepository.findById(req.getUsuarioId())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        Vehiculo v = Vehiculo.builder()
                .patente(req.getPatente().toUpperCase())
                .marca(req.getMarca())
                .modelo(req.getModelo())
                .color(req.getColor())
                .usuario(usuario)
                .activo(true)
                .build();

        return toResponse(vehiculoRepository.save(v));
    }

    public List<VehiculoDTO.Response> listarPorUsuario(Long usuarioId) {
        return vehiculoRepository.findByUsuarioIdAndActivoTrue(usuarioId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<VehiculoDTO.Response> listarTodos() {
        return vehiculoRepository.findByActivoTrue()
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public VehiculoDTO.Response obtener(Long id) {
        return toResponse(findOrThrow(id));
    }

    @Transactional
    public VehiculoDTO.Response actualizar(Long id, VehiculoDTO.UpdateRequest req) {
        Vehiculo v = findOrThrow(id);
        if (req.getMarca()  != null) v.setMarca(req.getMarca());
        if (req.getModelo() != null) v.setModelo(req.getModelo());
        if (req.getColor()  != null) v.setColor(req.getColor());
        return toResponse(vehiculoRepository.save(v));
    }

    @Transactional
    public void darDeBaja(Long id) {
        Vehiculo v = findOrThrow(id);
        v.setActivo(false);
        vehiculoRepository.save(v);
    }

    private Vehiculo findOrThrow(Long id) {
        return vehiculoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vehículo no encontrado: " + id));
    }

    private VehiculoDTO.Response toResponse(Vehiculo v) {
        return VehiculoDTO.Response.builder()
                .id(v.getId()).patente(v.getPatente())
                .marca(v.getMarca()).modelo(v.getModelo())
                .color(v.getColor()).activo(v.isActivo())
                .creadoEn(v.getCreadoEn())
                .usuarioId(v.getUsuario().getId())
                .usuarioNombre(v.getUsuario().getNombre() + " " + v.getUsuario().getApellido())
                .build();
    }
}
