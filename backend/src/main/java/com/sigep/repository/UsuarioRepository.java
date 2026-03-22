package com.sigep.repository;

import com.sigep.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findByDocumento(String documento);
    boolean existsByEmail(String email);
    boolean existsByDocumento(String documento);

    @Query("SELECT u FROM Usuario u WHERE u.activo = true AND " +
           "(LOWER(u.nombre) LIKE LOWER(CONCAT('%',:q,'%')) OR " +
           "LOWER(u.apellido) LIKE LOWER(CONCAT('%',:q,'%')) OR " +
           "LOWER(u.documento) LIKE LOWER(CONCAT('%',:q,'%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%',:q,'%')))")
    List<Usuario> buscar(@Param("q") String query);

    List<Usuario> findByActivoTrue();
}
