package com.stageflow.dto.auth;

import com.stageflow.dto.UsuarioResponse;

public class LoginResponse {

    private String token;
    private String tokenType;
    private UsuarioResponse user;

    public LoginResponse() {}

    public LoginResponse(String token, String tokenType, UsuarioResponse user) {
        this.token = token;
        this.tokenType = tokenType;
        this.user = user;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public UsuarioResponse getUser() { return user; }
    public void setUser(UsuarioResponse user) { this.user = user; }
}
