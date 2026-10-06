package com.stageflow.service;

import com.stageflow.domain.entity.Musica;
import com.stageflow.repository.MusicaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RepertorioService {

    private final MusicaRepository musicaRepository;

    @Transactional(readOnly = true)
    public List<Musica> listarPorTenant(String tenantId) {
        String effectiveTenant = (tenantId != null && !tenantId.isBlank()) ? tenantId : "tenant-default";
        return musicaRepository.findByTenantIdOrderByTituloAsc(effectiveTenant);
    }

    @Transactional
    public Musica criar(Musica musica) {
        if (musica.getTenantId() == null) {
            musica.setTenantId("tenant-default");
        }
        return musicaRepository.save(musica);
    }

    @Transactional
    public Musica atualizar(String id, Musica atualizacao) {
        Musica existente = musicaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Música não encontrada"));

        existente.setTitulo(atualizacao.getTitulo());
        existente.setArtista(atualizacao.getArtista());
        existente.setTom(atualizacao.getTom());
        existente.setGenero(atualizacao.getGenero());
        existente.setDuracao(atualizacao.getDuracao());
        existente.setLinkCifra(atualizacao.getLinkCifra());
        existente.setLinkAudio(atualizacao.getLinkAudio());
        existente.setObservacoes(atualizacao.getObservacoes());
        existente.setDocumentoNome(atualizacao.getDocumentoNome());
        existente.setDocumentoTipo(atualizacao.getDocumentoTipo());
        existente.setDocumentoConteudoTexto(atualizacao.getDocumentoConteudoTexto());
        existente.setAtiva(atualizacao.getAtiva());

        return musicaRepository.save(existente);
    }

    @Transactional
    public void excluir(String id) {
        musicaRepository.deleteById(id);
    }
}
