package com.sigep.dto;

import com.sigep.entity.Rol;
import com.sigep.entity.TipoUsuario;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

public class UsuarioDTO {

    @Getter @Setter
    public static class Request {
        @NotBlank private String nombre;
        @NotBlank private String apellido;
        @NotBlank private String documento;
        @Email @NotBlank private String email;
        @NotBlank @Size(min = 6) private String password;
        private String matricula;
        private String telefono;
        @NotNull private TipoUsuario tipoUsuario;
        @NotNull private Rol rol;
    }

    @Getter @Setter @Builder
    public static class Response {
        private Long id;
        private String nombre;
        private String apellido;
        private String documento;
        private String email;
        private String matricula;
        private String telefono;
        private TipoUsuario tipoUsuario;
        private Rol rol;
        private boolean activo;
        private LocalDateTime creadoEn;
        private List<VehiculoDTO.Response> vehiculos;
    }

    @Getter @Setter
    public static class UpdateRequest {
        private String nombre;
        private String apellido;
        private String telefono;
        private String matricula;
        private TipoUsuario tipoUsuario;
        private Rol rol;
    }
}
