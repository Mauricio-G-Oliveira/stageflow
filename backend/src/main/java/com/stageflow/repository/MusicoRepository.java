package com.stageflow.repository;

import com.stageflow.domain.entity.Musico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MusicoRepository extends JpaRepository<Musico, String> {

    List<Musico> findByTenantIdOrderByNomeAsc(String tenantId);
}
