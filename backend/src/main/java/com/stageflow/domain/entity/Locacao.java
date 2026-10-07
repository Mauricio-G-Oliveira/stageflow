package com.stageflow.domain.entity;

import com.stageflow.domain.enums.StatusLocacao;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_locacoes", indexes = {
    @Index(name = "idx_locacao_numero", columnList = "numero_contrato"),
    @Index(name = "idx_locacao_tenant", columnList = "tenant_id")
})
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
    private String itensJson;

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

    public Locacao() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.tenantId == null) this.tenantId = "tenant-default";
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNumeroContrato() { return numeroContrato; }
    public void setNumeroContrato(String numeroContrato) { this.numeroContrato = numeroContrato; }

    public String getClienteNome() { return clienteNome; }
    public void setClienteNome(String clienteNome) { this.clienteNome = clienteNome; }

    public String getClienteDocumento() { return clienteDocumento; }
    public void setClienteDocumento(String clienteDocumento) { this.clienteDocumento = clienteDocumento; }

    public String getClienteTelefone() { return clienteTelefone; }
    public void setClienteTelefone(String clienteTelefone) { this.clienteTelefone = clienteTelefone; }

    public String getClienteEmail() { return clienteEmail; }
    public void setClienteEmail(String clienteEmail) { this.clienteEmail = clienteEmail; }

    public String getEventoNome() { return eventoNome; }
    public void setEventoNome(String eventoNome) { this.eventoNome = eventoNome; }

    public String getLocalEvento() { return localEvento; }
    public void setLocalEvento(String localEvento) { this.localEvento = localEvento; }

    public String getDataRetiradaEntrega() { return dataRetiradaEntrega; }
    public void setDataRetiradaEntrega(String dataRetiradaEntrega) { this.dataRetiradaEntrega = dataRetiradaEntrega; }

    public LocalDate getDataEvento() { return dataEvento; }
    public void setDataEvento(LocalDate dataEvento) { this.dataEvento = dataEvento; }

    public String getDataDevolucao() { return dataDevolucao; }
    public void setDataDevolucao(String dataDevolucao) { this.dataDevolucao = dataDevolucao; }

    public StatusLocacao getStatus() { return status; }
    public void setStatus(StatusLocacao status) { this.status = status; }

    public String getItensJson() { return itensJson; }
    public void setItensJson(String itensJson) { this.itensJson = itensJson; }

    public Boolean getIncluiOperadorSom() { return incluiOperadorSom; }
    public void setIncluiOperadorSom(Boolean incluiOperadorSom) { this.incluiOperadorSom = incluiOperadorSom; }

    public BigDecimal getValorOperadorSom() { return valorOperadorSom; }
    public void setValorOperadorSom(BigDecimal valorOperadorSom) { this.valorOperadorSom = valorOperadorSom; }

    public Boolean getIncluiTransporteFrete() { return incluiTransporteFrete; }
    public void setIncluiTransporteFrete(Boolean incluiTransporteFrete) { this.incluiTransporteFrete = incluiTransporteFrete; }

    public BigDecimal getValorFrete() { return valorFrete; }
    public void setValorFrete(BigDecimal valorFrete) { this.valorFrete = valorFrete; }

    public BigDecimal getDesconto() { return desconto; }
    public void setDesconto(BigDecimal desconto) { this.desconto = desconto; }

    public BigDecimal getValorTotal() { return valorTotal; }
    public void setValorTotal(BigDecimal valorTotal) { this.valorTotal = valorTotal; }

    public BigDecimal getValorSinal() { return valorSinal; }
    public void setValorSinal(BigDecimal valorSinal) { this.valorSinal = valorSinal; }

    public String getFormaPagamento() { return formaPagamento; }
    public void setFormaPagamento(String formaPagamento) { this.formaPagamento = formaPagamento; }

    public String getChavePix() { return chavePix; }
    public void setChavePix(String chavePix) { this.chavePix = chavePix; }

    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }

    public String getTenantId() { return tenantId; }
    public void setTenantId(String tenantId) { this.tenantId = tenantId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
