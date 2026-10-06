package com.stageflow.repository;

import com.stageflow.domain.entity.Locacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LocacaoRepository extends JpaRepository<Locacao, String> {

    List<Locacao> findByTenantIdOrderByDataEventoAsc(String tenantId);

    Optional<Locacao> findByNumeroContrato(String numeroContrato);
}
