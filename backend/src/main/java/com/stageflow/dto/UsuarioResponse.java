package com.stageflow.dto;

import com.stageflow.domain.entity.Usuario;
import com.stageflow.domain.enums.PlanType;
import com.stageflow.domain.enums.Role;
import com.stageflow.domain.enums.SubscriptionStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioResponse {

    private String id;
    private String name;
    private String email;
    private Role role;
    private String phone;
    private String instrument;

    private PlanType planType;
    private SubscriptionStatus subscriptionStatus;
    private BigDecimal monthlyFee;
    private LocalDateTime expiresAt;
    private LocalDateTime lastPaymentDate;
    private String tenantId;
    private LocalDateTime createdAt;

    public static UsuarioResponse fromEntity(Usuario u) {
        return UsuarioResponse.builder()
                .id(u.getId())
                .name(u.getNome())
                .email(u.getEmail())
                .role(u.getRole())
                .phone(u.getTelefone())
                .instrument(u.getInstrumento())
                .planType(u.getPlanType())
                .subscriptionStatus(u.getSubscriptionStatus())
                .monthlyFee(u.getMonthlyFee())
                .expiresAt(u.getExpiresAt())
                .lastPaymentDate(u.getLastPaymentDate())
                .tenantId(u.getTenantId())
                .createdAt(u.getCreatedAt())
                .build();
    }
}
