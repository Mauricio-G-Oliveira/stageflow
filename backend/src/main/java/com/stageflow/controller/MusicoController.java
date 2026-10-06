package com.stageflow.controller;

import com.stageflow.domain.entity.Musico;
import com.stageflow.service.MusicoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/musicos")
@RequiredArgsConstructor
public class MusicoController {

    private final MusicoService musicoService;

    @GetMapping
    public ResponseEntity<List<Musico>> listar(
            @RequestHeader(value = "X-Tenant-ID", required = false, defaultValue = "tenant-default") String tenantId) {
        return ResponseEntity.ok(musicoService.listarPorTenant(tenantId));
    }

    @PostMapping
    public ResponseEntity<Musico> criar(@RequestBody Musico musico) {
        return ResponseEntity.status(HttpStatus.CREATED).body(musicoService.criar(musico));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Musico> atualizar(@PathVariable String id, @RequestBody Musico musico) {
        return ResponseEntity.ok(musicoService.atualizar(id, musico));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable String id) {
        musicoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
