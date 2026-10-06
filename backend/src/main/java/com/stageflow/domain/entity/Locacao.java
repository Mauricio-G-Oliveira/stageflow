package com.stageflow.domain.entity;

import com.stageflow.domain.enums.StatusLocacao;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_locacoes", indexes = {
    @Index(name = "idx_locacao_numero", columnList = "numero_contrato"),
    @Index(name = "idx_locacao_tenant", columnList = "tenant_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Locacao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "numero_contrato", nullable = false)
    private String numeroContrato;

    @Column(nullable = false)
    private String clienteNome;

    private String clienteDocumento;
    private String clienteTelefone;
    private String clienteEmail;

    @Column(nullable = false)
    private String eventoNome;

    private String localEvento;
    private String dataRetiradaEntrega;
    private LocalDate dataEvento;
    private String dataDevolucao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusLocacao status;

    @Column(columnDefinition = "TEXT")
    private String itensJson; // lista dos equipamentos locados

    private Boolean incluiOperadorSom;
    private BigDecimal valorOperadorSom;

    private Boolean incluiTransporteFrete;
    private BigDecimal valorFrete;

    private BigDecimal desconto;

    @Column(precision = 10, scale = 2)
    private BigDecimal valorTotal;

    @Column(precision = 10, scale = 2)
    private BigDecimal valorSinal;

    private String formaPagamento;
    private String chavePix;

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
