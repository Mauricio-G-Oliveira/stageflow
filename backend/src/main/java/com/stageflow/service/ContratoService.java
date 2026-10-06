package com.stageflow.service;

import com.stageflow.domain.entity.Contrato;
import com.stageflow.repository.ContratoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContratoService {

    private final ContratoRepository contratoRepository;

    @Transactional(readOnly = true)
    public List<Contrato> listarPorTenant(String tenantId) {
        String effectiveTenant = (tenantId != null && !tenantId.isBlank()) ? tenantId : "tenant-default";
        return contratoRepository.findByTenantIdOrderByCreatedAtDesc(effectiveTenant);
    }

    @Transactional
    public Contrato criar(Contrato contrato) {
        if (contrato.getTenantId() == null) {
            contrato.setTenantId("tenant-default");
        }
        if (contrato.getNumeroContrato() == null || contrato.getNumeroContrato().isBlank()) {
            long count = contratoRepository.count() + 1;
            contrato.setNumeroContrato(String.format("CTR-%d-%04d", Year.now().getValue(), count));
        }
        return contratoRepository.save(contrato);
    }

    @Transactional
    public void excluir(String id) {
        contratoRepository.deleteById(id);
    }
}
