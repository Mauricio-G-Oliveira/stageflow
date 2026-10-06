package com.stageflow.repository;

import com.stageflow.domain.entity.EquipamentoLocacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EquipamentoLocacaoRepository extends JpaRepository<EquipamentoLocacao, String> {

    List<EquipamentoLocacao> findByTenantIdOrderByNomeAsc(String tenantId);

    List<EquipamentoLocacao> findByTenantIdAndCategoria(String tenantId, String categoria);
}
