package com.stageflow.service;

import com.stageflow.domain.entity.Evento;
import com.stageflow.repository.EventoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventoService {

    private final EventoRepository eventoRepository;

    @Transactional(readOnly = true)
    public List<Evento> listarPorTenant(String tenantId) {
        String effectiveTenant = (tenantId != null && !tenantId.isBlank()) ? tenantId : "tenant-default";
        return eventoRepository.findByTenantIdOrderByDataEventoAsc(effectiveTenant);
    }

    @Transactional
    public Evento criar(Evento evento) {
        if (evento.getTenantId() == null) {
            evento.setTenantId("tenant-default");
        }
        return eventoRepository.save(evento);
    }

    @Transactional
    public Evento atualizar(String id, Evento atualizacao) {
        Evento existente = eventoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Evento não encontrado"));

        existente.setTitulo(atualizacao.getTitulo());
        existente.setTipoEvento(atualizacao.getTipoEvento());
        existente.setDataEvento(atualizacao.getDataEvento());
        existente.setStatus(atualizacao.getStatus());
        existente.setHorarioMontagem(atualizacao.getHorarioMontagem());
        existente.setHorarioPassagemSom(atualizacao.getHorarioPassagemSom());
        existente.setHorarioInicioShow(atualizacao.getHorarioInicioShow());
        existente.setTempoShowMinutos(atualizacao.getTempoShowMinutos());
        existente.setNumeroSets(atualizacao.getNumeroSets());
        existente.setIntervaloMinutos(atualizacao.getIntervaloMinutos());
        existente.setLocalNome(atualizacao.getLocalNome());
        existente.setEndereco(atualizacao.getEndereco());
        existente.setCidade(atualizacao.getCidade());
        existente.setEstado(atualizacao.getEstado());
        existente.setContratanteNome(atualizacao.getContratanteNome());
        existente.setContratanteTelefone(atualizacao.getContratanteTelefone());
        existente.setFechadoPorNome(atualizacao.getFechadoPorNome());
        existente.setComissaoValor(atualizacao.getComissaoValor());
        existente.setCacheTotal(atualizacao.getCacheTotal());
        existente.setCachePorMusico(atualizacao.getCachePorMusico());
        existente.setValorSinal(atualizacao.getValorSinal());
        existente.setFormaPagamento(atualizacao.getFormaPagamento());
        existente.setChavePixPagamento(atualizacao.getChavePixPagamento());
        existente.setObservacoes(atualizacao.getObservacoes());

        return eventoRepository.save(existente);
    }

    @Transactional
    public void excluir(String id) {
        eventoRepository.deleteById(id);
    }
}
