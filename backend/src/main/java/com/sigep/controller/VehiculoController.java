package com.sigep.controller;

import com.sigep.dto.VehiculoDTO;
import com.sigep.service.VehiculoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehiculos")
@RequiredArgsConstructor
public class VehiculoController {

    private final VehiculoService vehiculoService;

    @PostMapping
    public ResponseEntity<VehiculoDTO.Response> registrar(@Valid @RequestBody VehiculoDTO.Request req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(vehiculoService.registrar(req));
    }

    @GetMapping
    public ResponseEntity<List<VehiculoDTO.Response>> listar() {
        return ResponseEntity.ok(vehiculoService.listarTodos());
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<VehiculoDTO.Response>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(vehiculoService.listarPorUsuario(usuarioId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VehiculoDTO.Response> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(vehiculoService.obtener(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VehiculoDTO.Response> actualizar(@PathVariable Long id,
                                                            @RequestBody VehiculoDTO.UpdateRequest req) {
        return ResponseEntity.ok(vehiculoService.actualizar(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> baja(@PathVariable Long id) {
        vehiculoService.darDeBaja(id);
        return ResponseEntity.noContent().build();
    }
}
