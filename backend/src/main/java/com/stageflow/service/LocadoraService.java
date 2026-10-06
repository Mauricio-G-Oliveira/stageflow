package com.stageflow.service;

import com.stageflow.domain.entity.EquipamentoLocacao;
import com.stageflow.domain.entity.Locacao;
import com.stageflow.domain.enums.StatusLocacao;
import com.stageflow.repository.EquipamentoLocacaoRepository;
import com.stageflow.repository.LocacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LocadoraService {

    private final EquipamentoLocacaoRepository equipamentoRepository;
    private final LocacaoRepository locacaoRepository;

    @Transactional(readOnly = true)
    public List<EquipamentoLocacao> listarEquipamentos(String tenantId) {
        String effectiveTenant = (tenantId != null && !tenantId.isBlank()) ? tenantId : "tenant-default";
        return equipamentoRepository.findByTenantIdOrderByNomeAsc(effectiveTenant);
    }

    @Transactional
    public EquipamentoLocacao criarEquipamento(EquipamentoLocacao eq) {
        if (eq.getTenantId() == null) eq.setTenantId("tenant-default");
        return equipamentoRepository.save(eq);
    }

    @Transactional
    public void excluirEquipamento(String id) {
        equipamentoRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<Locacao> listarLocacoes(String tenantId) {
        String effectiveTenant = (tenantId != null && !tenantId.isBlank()) ? tenantId : "tenant-default";
        return locacaoRepository.findByTenantIdOrderByDataEventoAsc(effectiveTenant);
    }

    @Transactional
    public Locacao criarLocacao(Locacao loc) {
        if (loc.getTenantId() == null) loc.setTenantId("tenant-default");
        if (loc.getNumeroContrato() == null || loc.getNumeroContrato().isBlank()) {
            long count = locacaoRepository.count() + 1;
            loc.setNumeroContrato(String.format("LOC-%d-%03d", Year.now().getValue(), count));
        }
        return locacaoRepository.save(loc);
    }

    @Transactional
    public Locacao atualizarStatus(String id, StatusLocacao status) {
        Locacao loc = locacaoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Locação não encontrada"));
        loc.setStatus(status);
        return locacaoRepository.save(loc);
    }

    @Transactional
    public void excluirLocacao(String id) {
        locacaoRepository.deleteById(id);
    }
}
