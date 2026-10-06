package com.stageflow.controller;

import com.stageflow.domain.entity.Contrato;
import com.stageflow.service.ContratoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/contratos")
@RequiredArgsConstructor
public class ContratoController {

    private final ContratoService contratoService;

    @GetMapping
    public ResponseEntity<List<Contrato>> listar(
            @RequestHeader(value = "X-Tenant-ID", required = false, defaultValue = "tenant-default") String tenantId) {
        return ResponseEntity.ok(contratoService.listarPorTenant(tenantId));
    }

    @PostMapping
    public ResponseEntity<Contrato> criar(@RequestBody Contrato contrato) {
        return ResponseEntity.status(HttpStatus.CREATED).body(contratoService.criar(contrato));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable String id) {
        contratoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
