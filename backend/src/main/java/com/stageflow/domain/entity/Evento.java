package com.stageflow.domain.entity;

import com.stageflow.domain.enums.StatusEvento;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_eventos", indexes = {
    @Index(name = "idx_evento_data", columnList = "data_evento"),
    @Index(name = "idx_evento_tenant", columnList = "tenant_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String titulo;

    private String tipoEvento; // casamento, festa_fechada, etc.

    @Column(name = "data_evento", nullable = false)
    private LocalDate dataEvento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusEvento status;

    // Horários Técnicos de Palco
    private String horarioMontagem;
    private String horarioPassagemSom;
    private String horarioInicioShow;
    private Integer tempoShowMinutos;
    private Integer numeroSets;
    private Integer intervaloMinutos;

    // Local & Contratante
    private String localNome;
    private String endereco;
    private String cidade;
    private String estado;
    private String contratanteNome;
    private String contratanteTelefone;
    private String contratanteDocumento;

    // Quem Fechou o Show
    private String fechadoPorNome;
    private BigDecimal comissaoValor;

    // Financeiro
    @Column(precision = 10, scale = 2)
    private BigDecimal cacheTotal;

    @Column(precision = 10, scale = 2)
    private BigDecimal cachePorMusico;

    @Column(precision = 10, scale = 2)
    private BigDecimal valorSinal;

    private String formaPagamento;
    private String chavePixPagamento;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.tenantId == null) {
            this.tenantId = "tenant-default";
        }
    }
}
