package com.stageflow.controller;

import com.stageflow.domain.entity.EquipamentoLocacao;
import com.stageflow.domain.entity.Locacao;
import com.stageflow.domain.enums.StatusLocacao;
import com.stageflow.service.LocadoraService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/locadora")
@RequiredArgsConstructor
public class LocadoraController {

    private final LocadoraService locadoraService;

    // Equipamentos
    @GetMapping("/equipamentos")
    public ResponseEntity<List<EquipamentoLocacao>> listarEquipamentos(
            @RequestHeader(value = "X-Tenant-ID", required = false, defaultValue = "tenant-default") String tenantId) {
        return ResponseEntity.ok(locadoraService.listarEquipamentos(tenantId));
    }

    @PostMapping("/equipamentos")
    public ResponseEntity<EquipamentoLocacao> criarEquipamento(@RequestBody EquipamentoLocacao equipamento) {
        return ResponseEntity.status(HttpStatus.CREATED).body(locadoraService.criarEquipamento(equipamento));
    }

    @DeleteMapping("/equipamentos/{id}")
    public ResponseEntity<Void> excluirEquipamento(@PathVariable String id) {
        locadoraService.excluirEquipamento(id);
        return ResponseEntity.noContent().build();
    }

    // Locações
    @GetMapping("/locacoes")
    public ResponseEntity<List<Locacao>> listarLocacoes(
            @RequestHeader(value = "X-Tenant-ID", required = false, defaultValue = "tenant-default") String tenantId) {
        return ResponseEntity.ok(locadoraService.listarLocacoes(tenantId));
    }

    @PostMapping("/locacoes")
    public ResponseEntity<Locacao> criarLocacao(@RequestBody Locacao locacao) {
        return ResponseEntity.status(HttpStatus.CREATED).body(locadoraService.criarLocacao(locacao));
    }

    @PatchMapping("/locacoes/{id}/status")
    public ResponseEntity<Locacao> atualizarStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        StatusLocacao status = StatusLocacao.valueOf(body.get("status").toUpperCase());
        return ResponseEntity.ok(locadoraService.atualizarStatus(id, status));
    }

    @DeleteMapping("/locacoes/{id}")
    public ResponseEntity<Void> excluirLocacao(@PathVariable String id) {
        locadoraService.excluirLocacao(id);
        return ResponseEntity.noContent().build();
    }
}
