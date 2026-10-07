package com.stageflow.domain.entity;

import com.stageflow.domain.enums.StatusEvento;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_eventos", indexes = {
    @Index(name = "idx_evento_data", columnList = "data_evento"),
    @Index(name = "idx_evento_tenant", columnList = "tenant_id")
})
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String titulo;

    private String tipoEvento;

    @Column(name = "data_evento", nullable = false)
    private LocalDate dataEvento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusEvento status;

    private String horarioMontagem;
    private String horarioPassagemSom;
    private String horarioInicioShow;
    private Integer tempoShowMinutos;
    private Integer numeroSets;
    private Integer intervaloMinutos;

    private String localNome;
    private String endereco;
    private String cidade;
    private String estado;
    private String contratanteNome;
    private String contratanteTelefone;
    private String contratanteDocumento;

    private String fechadoPorNome;
    private BigDecimal comissaoValor;

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

    public Evento() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.tenantId == null) {
            this.tenantId = "tenant-default";
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getTipoEvento() { return tipoEvento; }
    public void setTipoEvento(String tipoEvento) { this.tipoEvento = tipoEvento; }

    public LocalDate getDataEvento() { return dataEvento; }
    public void setDataEvento(LocalDate dataEvento) { this.dataEvento = dataEvento; }

    public StatusEvento getStatus() { return status; }
    public void setStatus(StatusEvento status) { this.status = status; }

    public String getHorarioMontagem() { return horarioMontagem; }
    public void setHorarioMontagem(String horarioMontagem) { this.horarioMontagem = horarioMontagem; }

    public String getHorarioPassagemSom() { return horarioPassagemSom; }
    public void setHorarioPassagemSom(String horarioPassagemSom) { this.horarioPassagemSom = horarioPassagemSom; }

    public String getHorarioInicioShow() { return horarioInicioShow; }
    public void setHorarioInicioShow(String horarioInicioShow) { this.horarioInicioShow = horarioInicioShow; }

    public Integer getTempoShowMinutos() { return tempoShowMinutos; }
    public void setTempoShowMinutos(Integer tempoShowMinutos) { this.tempoShowMinutos = tempoShowMinutos; }

    public Integer getNumeroSets() { return numeroSets; }
    public void setNumeroSets(Integer numeroSets) { this.numeroSets = numeroSets; }

    public Integer getIntervaloMinutos() { return intervaloMinutos; }
    public void setIntervaloMinutos(Integer intervaloMinutos) { this.intervaloMinutos = intervaloMinutos; }

    public String getLocalNome() { return localNome; }
    public void setLocalNome(String localNome) { this.localNome = localNome; }

    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }

    public String getCidade() { return cidade; }
    public void setCidade(String cidade) { this.cidade = cidade; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getContratanteNome() { return contratanteNome; }
    public void setContratanteNome(String contratanteNome) { this.contratanteNome = contratanteNome; }

    public String getContratanteTelefone() { return contratanteTelefone; }
    public void setContratanteTelefone(String contratanteTelefone) { this.contratanteTelefone = contratanteTelefone; }

    public String getContratanteDocumento() { return contratanteDocumento; }
    public void setContratanteDocumento(String contratanteDocumento) { this.contratanteDocumento = contratanteDocumento; }

    public String getFechadoPorNome() { return fechadoPorNome; }
    public void setFechadoPorNome(String fechadoPorNome) { this.fechadoPorNome = fechadoPorNome; }

    public BigDecimal getComissaoValor() { return comissaoValor; }
    public void setComissaoValor(BigDecimal comissaoValor) { this.comissaoValor = comissaoValor; }

    public BigDecimal getCacheTotal() { return cacheTotal; }
    public void setCacheTotal(BigDecimal cacheTotal) { this.cacheTotal = cacheTotal; }

    public BigDecimal getCachePorMusico() { return cachePorMusico; }
    public void setCachePorMusico(BigDecimal cachePorMusico) { this.cachePorMusico = cachePorMusico; }

    public BigDecimal getValorSinal() { return valorSinal; }
    public void setValorSinal(BigDecimal valorSinal) { this.valorSinal = valorSinal; }

    public String getFormaPagamento() { return formaPagamento; }
    public void setFormaPagamento(String formaPagamento) { this.formaPagamento = formaPagamento; }

    public String getChavePixPagamento() { return chavePixPagamento; }
    public void setChavePixPagamento(String chavePixPagamento) { this.chavePixPagamento = chavePixPagamento; }

    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }

    public String getTenantId() { return tenantId; }
    public void setTenantId(String tenantId) { this.tenantId = tenantId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
