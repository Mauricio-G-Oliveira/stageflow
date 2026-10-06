package com.stageflow.service;

import com.stageflow.domain.entity.Usuario;
import com.stageflow.domain.enums.PlanType;
import com.stageflow.domain.enums.Role;
import com.stageflow.domain.enums.SubscriptionStatus;
import com.stageflow.dto.UsuarioResponse;
import com.stageflow.dto.auth.LoginRequest;
import com.stageflow.dto.auth.LoginResponse;
import com.stageflow.dto.auth.RegisterRequest;
import com.stageflow.repository.UsuarioRepository;
import com.stageflow.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword())
        );

        String token = tokenProvider.generateToken(authentication);

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        // Se a conta estiver vencida e não for admin, atualiza dinamicamente
        if (usuario.getRole() != Role.ADMIN && usuario.getExpiresAt() != null) {
            if (usuario.getExpiresAt().isBefore(LocalDateTime.now())) {
                usuario.setSubscriptionStatus(SubscriptionStatus.VENCIDO);
            }
        }

        return LoginResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .user(UsuarioResponse.fromEntity(usuario))
                .build();
    }

    @Transactional
    public UsuarioResponse register(RegisterRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (usuarioRepository.existsByEmail(normalizedEmail)) {
            throw new IllegalArgumentException("Já existe um usuário cadastrado com este e-mail.");
        }

        Role role = request.getRole() != null ? request.getRole() : Role.MUSICO;
        PlanType planType = request.getPlanType() != null ? request.getPlanType() : PlanType.MENSAL_30_DIAS;
        int days = request.getCustomDays() != null ? request.getCustomDays() : (planType == PlanType.TESTE_3_DIAS ? 3 : 30);

        SubscriptionStatus status = (role == Role.ADMIN)
                ? SubscriptionStatus.ISENTO
                : (planType == PlanType.TESTE_3_DIAS ? SubscriptionStatus.TESTE : SubscriptionStatus.ATIVO);

        LocalDateTime expiresAt = (role == Role.ADMIN)
                ? LocalDateTime.of(2099, 12, 31, 23, 59)
                : LocalDateTime.now().plusDays(days);

        BigDecimal fee = (planType == PlanType.TESTE_3_DIAS || role == Role.ADMIN)
                ? BigDecimal.ZERO
                : (request.getMonthlyFee() != null ? request.getMonthlyFee() : new BigDecimal("49.90"));

        Usuario novoUsuario = Usuario.builder()
                .nome(request.getName().trim())
                .email(normalizedEmail)
                .senha(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .telefone(request.getPhone())
                .instrumento(request.getInstrument())
                .planType(planType)
                .subscriptionStatus(status)
                .monthlyFee(fee)
                .expiresAt(expiresAt)
                .lastPaymentDate(planType == PlanType.TESTE_3_DIAS ? null : LocalDateTime.now())
                .tenantId("tenant-default")
                .build();

        Usuario salvo = usuarioRepository.save(novoUsuario);
        return UsuarioResponse.fromEntity(salvo);
    }

    @Transactional(readOnly = true)
    public UsuarioResponse getCurrentUser(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
        return UsuarioResponse.fromEntity(usuario);
    }
}
