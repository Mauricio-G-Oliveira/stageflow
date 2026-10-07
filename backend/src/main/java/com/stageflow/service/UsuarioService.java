package com.stageflow.service;

import com.stageflow.domain.entity.Usuario;
import com.stageflow.domain.enums.Role;
import com.stageflow.domain.enums.SubscriptionStatus;
import com.stageflow.dto.UsuarioResponse;
import com.stageflow.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponse> listarTodos(String tenantId) {
        String effectiveTenant = (tenantId != null && !tenantId.isBlank()) ? tenantId : "tenant-default";
        List<Usuario> usuarios = usuarioRepository.findByTenantId(effectiveTenant);
        LocalDateTime now = LocalDateTime.now();

        return usuarios.stream()
                .peek(u -> {
                    if (u.getRole() != Role.ADMIN && u.getExpiresAt() != null) {
                        if (u.getExpiresAt().isBefore(now)) {
                            u.setSubscriptionStatus(SubscriptionStatus.VENCIDO);
                        }
                    }
                })
                .map(UsuarioResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public UsuarioResponse renovarAcesso(String id, int diasAdicionais) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime base = (usuario.getExpiresAt() != null && usuario.getExpiresAt().isAfter(now))
                ? usuario.getExpiresAt()
                : now;

        usuario.setExpiresAt(base.plusDays(diasAdicionais));
        usuario.setSubscriptionStatus(SubscriptionStatus.ATIVO);
        usuario.setLastPaymentDate(now);

        Usuario atualizado = usuarioRepository.save(usuario);
        return UsuarioResponse.fromEntity(atualizado);
    }

    @Transactional
    public void alterarSenha(String id, String novaSenha) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        if (novaSenha == null || novaSenha.trim().length() < 6) {
            throw new IllegalArgumentException("A nova senha deve ter no mínimo 6 caracteres.");
        }

        usuario.setSenha(passwordEncoder.encode(novaSenha.trim()));
        usuarioRepository.save(usuario);
    }

    @Transactional
    public void excluir(String id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        if (usuario.getRole() == Role.ADMIN && "mauriciogoulart.deoliveira37@gmail.com".equalsIgnoreCase(usuario.getEmail())) {
            throw new IllegalStateException("Não é permitido excluir o usuário Administrador principal.");
        }

        usuarioRepository.deleteById(id);
    }
}
