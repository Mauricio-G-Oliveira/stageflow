package com.stageflow.repository;

import com.stageflow.domain.entity.Musica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MusicaRepository extends JpaRepository<Musica, String> {

    List<Musica> findByTenantIdOrderByTituloAsc(String tenantId);

    List<Musica> findByTenantIdAndGenero(String tenantId, String genero);
}
