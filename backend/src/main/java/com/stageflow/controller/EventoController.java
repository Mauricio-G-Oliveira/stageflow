package com.stageflow.controller;

import com.stageflow.domain.entity.Evento;
import com.stageflow.service.EventoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/eventos")
@RequiredArgsConstructor
public class EventoController {

    private final EventoService eventoService;

    @GetMapping
    public ResponseEntity<List<Evento>> listar(
            @RequestHeader(value = "X-Tenant-ID", required = false, defaultValue = "tenant-default") String tenantId) {
        return ResponseEntity.ok(eventoService.listarPorTenant(tenantId));
    }

    @PostMapping
    public ResponseEntity<Evento> criar(@RequestBody Evento evento) {
        return ResponseEntity.status(HttpStatus.CREATED).body(eventoService.criar(evento));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Evento> atualizar(@PathVariable String id, @RequestBody Evento evento) {
        return ResponseEntity.ok(eventoService.atualizar(id, evento));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable String id) {
        eventoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
