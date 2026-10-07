package com.stageflow.controller;

import com.stageflow.dto.UsuarioResponse;
import com.stageflow.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UsuarioResponse>> listarTodos(
            @RequestHeader(value = "X-Tenant-ID", required = false, defaultValue = "tenant-default") String tenantId) {
        return ResponseEntity.ok(usuarioService.listarTodos(tenantId));
    }

    @PostMapping("/{id}/renovar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioResponse> renovarAcesso(
            @PathVariable String id,
            @RequestBody(required = false) Map<String, Integer> body) {
        int dias = (body != null && body.containsKey("dias")) ? body.get("dias") : 30;
        return ResponseEntity.ok(usuarioService.renovarAcesso(id, dias));
    }

    @PatchMapping("/{id}/senha")
    public ResponseEntity<Void> alterarSenha(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        String novaSenha = body.get("novaSenha");
        usuarioService.alterarSenha(id, novaSenha);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> excluir(@PathVariable String id) {
        usuarioService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
