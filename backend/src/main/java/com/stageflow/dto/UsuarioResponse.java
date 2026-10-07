package com.stageflow.dto;

import com.stageflow.domain.entity.Usuario;
import com.stageflow.domain.enums.PlanType;
import com.stageflow.domain.enums.Role;
import com.stageflow.domain.enums.SubscriptionStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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

    public UsuarioResponse() {}

    public static UsuarioResponse fromEntity(Usuario u) {
        UsuarioResponse r = new UsuarioResponse();
        r.setId(u.getId());
        r.setName(u.getNome());
        r.setEmail(u.getEmail());
        r.setRole(u.getRole());
        r.setPhone(u.getTelefone());
        r.setInstrument(u.getInstrumento());
        r.setPlanType(u.getPlanType());
        r.setSubscriptionStatus(u.getSubscriptionStatus());
        r.setMonthlyFee(u.getMonthlyFee());
        r.setExpiresAt(u.getExpiresAt());
        r.setLastPaymentDate(u.getLastPaymentDate());
        r.setTenantId(u.getTenantId());
        r.setCreatedAt(u.getCreatedAt());
        return r;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getInstrument() { return instrument; }
    public void setInstrument(String instrument) { this.instrument = instrument; }

    public PlanType getPlanType() { return planType; }
    public void setPlanType(PlanType planType) { this.planType = planType; }

    public SubscriptionStatus getSubscriptionStatus() { return subscriptionStatus; }
    public void setSubscriptionStatus(SubscriptionStatus subscriptionStatus) { this.subscriptionStatus = subscriptionStatus; }

    public BigDecimal getMonthlyFee() { return monthlyFee; }
    public void setMonthlyFee(BigDecimal monthlyFee) { this.monthlyFee = monthlyFee; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

    public LocalDateTime getLastPaymentDate() { return lastPaymentDate; }
    public void setLastPaymentDate(LocalDateTime lastPaymentDate) { this.lastPaymentDate = lastPaymentDate; }

    public String getTenantId() { return tenantId; }
    public void setTenantId(String tenantId) { this.tenantId = tenantId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
