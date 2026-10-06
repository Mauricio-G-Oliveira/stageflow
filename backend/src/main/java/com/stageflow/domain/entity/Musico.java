package com.stageflow.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_musicos", indexes = {
    @Index(name = "idx_musico_tenant", columnList = "tenant_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Musico {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String nome;

    private String instrumento;
    private String telefone;
    private String email;

    @Column(precision = 10, scale = 2)
    private BigDecimal cachePadrao;

    private String chavePix;
    private Boolean ativo;

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.ativo == null) this.ativo = true;
        if (this.tenantId == null) this.tenantId = "tenant-default";
    }
}
