package com.stageflow.service;

import com.stageflow.domain.entity.Musico;
import com.stageflow.repository.MusicoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MusicoService {

    private final MusicoRepository musicoRepository;

    @Transactional(readOnly = true)
    public List<Musico> listarPorTenant(String tenantId) {
        String effectiveTenant = (tenantId != null && !tenantId.isBlank()) ? tenantId : "tenant-default";
        return musicoRepository.findByTenantIdOrderByNomeAsc(effectiveTenant);
    }

    @Transactional
    public Musico criar(Musico musico) {
        if (musico.getTenantId() == null) {
            musico.setTenantId("tenant-default");
        }
        return musicoRepository.save(musico);
    }

    @Transactional
    public Musico atualizar(String id, Musico atualizacao) {
        Musico existente = musicoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Músico não encontrado"));

        existente.setNome(atualizacao.getNome());
        existente.setInstrumento(atualizacao.getInstrumento());
        existente.setTelefone(atualizacao.getTelefone());
        existente.setEmail(atualizacao.getEmail());
        existente.setCachePadrao(atualizacao.getCachePadrao());
        existente.setChavePix(atualizacao.getChavePix());
        existente.setAtivo(atualizacao.getAtivo());

        return musicoRepository.save(existente);
    }

    @Transactional
    public void excluir(String id) {
        musicoRepository.deleteById(id);
    }
}
