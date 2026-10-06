package com.stageflow.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tb_contratos", indexes = {
    @Index(name = "idx_contrato_numero", columnList = "numero_contrato"),
    @Index(name = "idx_contrato_tenant", columnList = "tenant_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contrato {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "numero_contrato", nullable = false)
    private String numeroContrato;

    private String eventoId;
    private String modelo; // casamento, festa_fechada, etc.
    private String status; // rascunho, emitido, assinado

    @Column(columnDefinition = "TEXT")
    private String dadosJson; // payload estruturado das partes, detalhes e cláusulas

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.tenantId == null) this.tenantId = "tenant-default";
    }
}
