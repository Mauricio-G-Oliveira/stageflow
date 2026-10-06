package com.stageflow.repository;

import com.stageflow.domain.entity.Evento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventoRepository extends JpaRepository<Evento, String> {

    List<Evento> findByTenantIdOrderByDataEventoAsc(String tenantId);

    List<Evento> findByTenantIdAndDataEventoBetween(String tenantId, LocalDate inicio, LocalDate fim);
}
