package com.stageflow.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tb_repertorio", indexes = {
    @Index(name = "idx_musica_titulo", columnList = "titulo"),
    @Index(name = "idx_musica_tenant", columnList = "tenant_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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

    // Documento Anexo (PDF ou DOCX para visualizador de palco)
    private String documentoNome;
    private String documentoTipo; // pdf, docx, txt

    @Column(columnDefinition = "TEXT")
    private String documentoConteudoTexto;

    private Boolean ativa;

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.ativa == null) this.ativa = true;
        if (this.tenantId == null) this.tenantId = "tenant-default";
    }
}
