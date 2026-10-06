package com.stageflow.data;

import com.stageflow.domain.entity.EquipamentoLocacao;
import com.stageflow.domain.entity.Musica;
import com.stageflow.domain.entity.Musico;
import com.stageflow.domain.entity.Usuario;
import com.stageflow.domain.enums.PlanType;
import com.stageflow.domain.enums.Role;
import com.stageflow.domain.enums.SubscriptionStatus;
import com.stageflow.repository.EquipamentoLocacaoRepository;
import com.stageflow.repository.MusicaRepository;
import com.stageflow.repository.MusicoRepository;
import com.stageflow.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final MusicoRepository musicoRepository;
    private final MusicaRepository musicaRepository;
    private final EquipamentoLocacaoRepository equipamentoRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdminUser();
        seedMusicos();
        seedRepertorio();
        seedEquipamentos();
    }

    private void seedAdminUser() {
        String adminEmail = "mauriciogoulart.deoliveira37@gmail.com";
        if (usuarioRepository.findByEmail(adminEmail).isEmpty()) {
            Usuario admin = Usuario.builder()
                    .nome("Mauricio G. Oliveira")
                    .email(adminEmail)
                    .senha(passwordEncoder.encode("xb100pro2815"))
                    .role(Role.ADMIN)
                    .telefone("(11) 99999-9999")
                    .instrumento("Direção Musical / Baixo")
                    .planType(PlanType.ISENTO_ADMIN)
                    .subscriptionStatus(SubscriptionStatus.ISENTO)
                    .monthlyFee(BigDecimal.ZERO)
                    .expiresAt(LocalDateTime.of(2099, 12, 31, 23, 59))
                    .tenantId("tenant-default")
                    .build();

            usuarioRepository.save(admin);
            log.info(">> [DATABASE SEED] Administrador padrao criado com sucesso: {} (Senha: xb100pro2815)", adminEmail);
        }
    }

    private void seedMusicos() {
        if (musicoRepository.count() == 0) {
            musicoRepository.save(Musico.builder()
                    .nome("Mauricio Oliveira")
                    .instrumento("Contrabaixo / Produção")
                    .telefone("(11) 99999-9999")
                    .email("mauriciogoulart.deoliveira37@gmail.com")
                    .cachePadrao(new BigDecimal("350.00"))
                    .chavePix("mauriciogoulart.deoliveira37@gmail.com")
                    .ativo(true)
                    .tenantId("tenant-default")
                    .build());

            musicoRepository.save(Musico.builder()
                    .nome("Lucas Ribeiro")
                    .instrumento("Voz Principal / Violão")
                    .telefone("(11) 98888-8888")
                    .cachePadrao(new BigDecimal("350.00"))
                    .chavePix("lucas.voz@pix.com.br")
                    .ativo(true)
                    .tenantId("tenant-default")
                    .build());

            musicoRepository.save(Musico.builder()
                    .nome("André Silveira")
                    .instrumento("Guitarra Solo")
                    .telefone("(11) 97777-7777")
                    .cachePadrao(new BigDecimal("350.00"))
                    .chavePix("andre.guitar@pix.com.br")
                    .ativo(true)
                    .tenantId("tenant-default")
                    .build());

            musicoRepository.save(Musico.builder()
                    .nome("Felipe Teclados")
                    .instrumento("Teclado & Synth")
                    .telefone("(11) 96666-6666")
                    .cachePadrao(new BigDecimal("350.00"))
                    .chavePix("felipe.keys@pix.com.br")
                    .ativo(true)
                    .tenantId("tenant-default")
                    .build());

            musicoRepository.save(Musico.builder()
                    .nome("Rodrigo Bateria")
                    .instrumento("Bateria & Sampler")
                    .telefone("(11) 95555-5555")
                    .cachePadrao(new BigDecimal("350.00"))
                    .chavePix("rodrigo.drums@pix.com.br")
                    .ativo(true)
                    .tenantId("tenant-default")
                    .build());

            log.info(">> [DATABASE SEED] Formacao da banda (5 musicos) cadastrada!");
        }
    }

    private void seedRepertorio() {
        if (musicaRepository.count() == 0) {
            musicaRepository.save(Musica.builder()
                    .titulo("Tempo Perdido")
                    .artista("Legião Urbana")
                    .tom("C")
                    .genero("Pop Rock")
                    .duracao("4:15")
                    .linkCifra("https://www.cifraclub.com.br/legiao-urbana/tempo-perdido/")
                    .observacoes("Solo estendido no final; entrada direta na caixa da bateria.")
                    .ativa(true)
                    .tenantId("tenant-default")
                    .build());

            musicaRepository.save(Musica.builder()
                    .titulo("Primeiros Erros")
                    .artista("Capital Inicial")
                    .tom("G")
                    .genero("Pop Rock")
                    .duracao("3:45")
                    .linkCifra("https://www.cifraclub.com.br/capital-inicial/primeiros-erros/")
                    .observacoes("Entrada acústica; banda entra no segundo verso.")
                    .ativa(true)
                    .tenantId("tenant-default")
                    .build());

            musicaRepository.save(Musica.builder()
                    .titulo("Evidências")
                    .artista("Chitãozinho & Xororó")
                    .tom("E")
                    .genero("Sertanejo")
                    .duracao("4:30")
                    .linkCifra("https://www.cifraclub.com.br/chitaozinho-xororo/evidencias/")
                    .observacoes("Clássico obrigatório em casamentos e formaturas.")
                    .ativa(true)
                    .tenantId("tenant-default")
                    .build());

            log.info(">> [DATABASE SEED] Repertorio inicial semeado com sucesso!");
        }
    }

    private void seedEquipamentos() {
        if (equipamentoRepository.count() == 0) {
            equipamentoRepository.save(EquipamentoLocacao.builder()
                    .codigo("PA-01")
                    .nome("Caixa Ativa RCF ART 715-A (15\" 1400W)")
                    .categoria("som_pa")
                    .marcaModelo("RCF / ART 715 MK4")
                    .quantidadeTotal(4)
                    .quantidadeDisponivel(4)
                    .valorDiaria(new BigDecimal("180.00"))
                    .estado("excelente")
                    .observacoes("Acompanha cabo Powercon e capa protetora")
                    .tenantId("tenant-default")
                    .build());

            equipamentoRepository.save(EquipamentoLocacao.builder()
                    .codigo("SUB-01")
                    .nome("Subwoofer Ativo 18\" JBL SRX818SP (1000W RMS)")
                    .categoria("som_pa")
                    .marcaModelo("JBL / SRX818SP")
                    .quantidadeTotal(2)
                    .quantidadeDisponivel(2)
                    .valorDiaria(new BigDecimal("250.00"))
                    .estado("excelente")
                    .observacoes("Potência e pressão para eventos médios e grandes")
                    .tenantId("tenant-default")
                    .build());

            equipamentoRepository.save(EquipamentoLocacao.builder()
                    .codigo("MIX-01")
                    .nome("Mesa de Som Digital Behringer X32 Compact")
                    .categoria("mesa_som")
                    .marcaModelo("Behringer / X32 Compact")
                    .quantidadeTotal(1)
                    .quantidadeDisponivel(1)
                    .valorDiaria(new BigDecimal("350.00"))
                    .estado("excelente")
                    .observacoes("Acompanha roteador Wi-Fi 5GHz para controle via iPad")
                    .tenantId("tenant-default")
                    .build());

            equipamentoRepository.save(EquipamentoLocacao.builder()
                    .codigo("MIC-01")
                    .nome("Microfone Sem Fio Duplo Shure GLXD4 (Beta 58A)")
                    .categoria("microfones")
                    .marcaModelo("Shure / GLXD4 Beta 58A")
                    .quantidadeTotal(2)
                    .quantidadeDisponivel(2)
                    .valorDiaria(new BigDecimal("150.00"))
                    .estado("excelente")
                    .observacoes("Baterias recarregáveis inclusas")
                    .tenantId("tenant-default")
                    .build());

            log.info(">> [DATABASE SEED] Equipamentos da Locadora de Som semeados!");
        }
    }
}
