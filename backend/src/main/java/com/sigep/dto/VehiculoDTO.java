package com.sigep.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDateTime;

public class VehiculoDTO {

    @Getter @Setter
    public static class Request {
        @NotBlank private String patente;
        @NotBlank private String marca;
        @NotBlank private String modelo;
        @NotBlank private String color;
        @NotNull  private Long usuarioId;
    }

    @Getter @Setter @Builder
    public static class Response {
        private Long id;
        private String patente;
        private String marca;
        private String modelo;
        private String color;
        private boolean activo;
        private LocalDateTime creadoEn;
        private Long usuarioId;
        private String usuarioNombre;
    }

    @Getter @Setter
    public static class UpdateRequest {
        private String marca;
        private String modelo;
        private String color;
    }
}
