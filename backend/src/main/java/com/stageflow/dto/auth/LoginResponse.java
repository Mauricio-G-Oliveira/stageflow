package com.stageflow.dto.auth;

import com.stageflow.dto.UsuarioResponse;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {

    private String token;
    private String tokenType;
    private UsuarioResponse user;
}
