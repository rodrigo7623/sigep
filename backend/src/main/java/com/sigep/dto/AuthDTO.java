package com.sigep.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import com.sigep.entity.Rol;

public class AuthDTO {

    @Getter @Setter
    public static class LoginRequest {
        @Email @NotBlank private String email;
        @NotBlank private String password;
    }

    @Getter @Setter @Builder @AllArgsConstructor @NoArgsConstructor
    public static class LoginResponse {
        private Long id;
        private String nombre;
        private String apellido;
        private String email;
        private Rol rol;
        private String mensaje;
    }
}
