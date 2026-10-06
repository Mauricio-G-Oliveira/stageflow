package com.stageflow.controller;

import com.stageflow.domain.entity.Musica;
import com.stageflow.service.RepertorioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/repertorio")
@RequiredArgsConstructor
public class RepertorioController {

    private final RepertorioService repertorioService;

    @GetMapping
    public ResponseEntity<List<Musica>> listar(
            @RequestHeader(value = "X-Tenant-ID", required = false, defaultValue = "tenant-default") String tenantId) {
        return ResponseEntity.ok(repertorioService.listarPorTenant(tenantId));
    }

    @PostMapping
    public ResponseEntity<Musica> criar(@RequestBody Musica musica) {
        return ResponseEntity.status(HttpStatus.CREATED).body(repertorioService.criar(musica));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Musica> atualizar(@PathVariable String id, @RequestBody Musica musica) {
        return ResponseEntity.ok(repertorioService.atualizar(id, musica));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable String id) {
        repertorioService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
