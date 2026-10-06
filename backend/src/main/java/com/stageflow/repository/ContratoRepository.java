package com.stageflow.repository;

import com.stageflow.domain.entity.Contrato;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContratoRepository extends JpaRepository<Contrato, String> {

    List<Contrato> findByTenantIdOrderByCreatedAtDesc(String tenantId);

    Optional<Contrato> findByNumeroContrato(String numeroContrato);
}
