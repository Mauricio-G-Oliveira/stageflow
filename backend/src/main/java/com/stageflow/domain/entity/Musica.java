package com.stageflow.domain.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tb_repertorio", indexes = {
    @Index(name = "idx_musica_titulo", columnList = "titulo"),
    @Index(name = "idx_musica_tenant", columnList = "tenant_id")
})
public class Musica {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false)
    private String artista;

    @Column(length = 10)
    private String tom;

    private String genero;
    private String duracao;
    private String linkCifra;
    private String linkAudio;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    private String documentoNome;
    private String documentoTipo;

    @Column(columnDefinition = "TEXT")
    private String documentoConteudoTexto;

    private Boolean ativa;

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Musica() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.ativa == null) this.ativa = true;
        if (this.tenantId == null) this.tenantId = "tenant-default";
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getArtista() { return artista; }
    public void setArtista(String artista) { this.artista = artista; }

    public String getTom() { return tom; }
    public void setTom(String tom) { this.tom = tom; }

    public String getGenero() { return genero; }
    public void setGenero(String genero) { this.genero = genero; }

    public String getDuracao() { return duracao; }
    public void setDuracao(String duracao) { this.duracao = duracao; }

    public String getLinkCifra() { return linkCifra; }
    public void setLinkCifra(String linkCifra) { this.linkCifra = linkCifra; }

    public String getLinkAudio() { return linkAudio; }
    public void setLinkAudio(String linkAudio) { this.linkAudio = linkAudio; }

    public String getObservacoes() { return observacoes; }
    public void setObservacoes(String observacoes) { this.observacoes = observacoes; }

    public String getDocumentoNome() { return documentoNome; }
    public void setDocumentoNome(String documentoNome) { this.documentoNome = documentoNome; }

    public String getDocumentoTipo() { return documentoTipo; }
    public void setDocumentoTipo(String documentoTipo) { this.documentoTipo = documentoTipo; }

    public String getDocumentoConteudoTexto() { return documentoConteudoTexto; }
    public void setDocumentoConteudoTexto(String documentoConteudoTexto) { this.documentoConteudoTexto = documentoConteudoTexto; }

    public Boolean getAtiva() { return ativa; }
    public void setAtiva(Boolean ativa) { this.ativa = ativa; }

    public String getTenantId() { return tenantId; }
    public void setTenantId(String tenantId) { this.tenantId = tenantId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
