package com.sigep.repository;

import com.sigep.entity.Vehiculo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface VehiculoRepository extends JpaRepository<Vehiculo, Long> {
    Optional<Vehiculo> findByPatente(String patente);
    boolean existsByPatente(String patente);
    List<Vehiculo> findByUsuarioIdAndActivoTrue(Long usuarioId);
    List<Vehiculo> findByActivoTrue();
}
