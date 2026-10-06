package com.stageflow.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_equipamentos_locacao", indexes = {
    @Index(name = "idx_equipamento_codigo", columnList = "codigo"),
    @Index(name = "idx_equipamento_tenant", columnList = "tenant_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EquipamentoLocacao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String codigo;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String categoria;

    private String marcaModelo;
    private Integer quantidadeTotal;
    private Integer quantidadeDisponivel;

    @Column(precision = 10, scale = 2)
    private BigDecimal valorDiaria;

    private String estado; // excelente, bom, manutencao

    @Column(columnDefinition = "TEXT")
    private String observacoes;

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
