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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSeeder.class);

    private final UsuarioRepository usuarioRepository;
    private final MusicoRepository musicoRepository;
    private final MusicaRepository musicaRepository;
    private final EquipamentoLocacaoRepository equipamentoRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(
            UsuarioRepository usuarioRepository,
            MusicoRepository musicoRepository,
            MusicaRepository musicaRepository,
            EquipamentoLocacaoRepository equipamentoRepository,
            PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.musicoRepository = musicoRepository;
        this.musicaRepository = musicaRepository;
        this.equipamentoRepository = equipamentoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedAdminUser();
        seedMusicos();
        seedRepertorio();
        seedEquipamentos();
    }

    @org.springframework.beans.factory.annotation.Value("${STAGEFLOW_ADMIN_PASSWORD:admin-stageflow-initial}")
    private String defaultAdminPassword;

    private void seedAdminUser() {
        String adminEmail = "mauriciogoulart.deoliveira37@gmail.com";
        if (usuarioRepository.findByEmail(adminEmail).isEmpty()) {
            Usuario admin = new Usuario();
            admin.setNome("Mauricio G. Oliveira");
            admin.setEmail(adminEmail);
            admin.setSenha(passwordEncoder.encode(defaultAdminPassword));
            admin.setRole(Role.ADMIN);
            admin.setTelefone("(11) 99999-9999");
            admin.setInstrumento("Direção Musical / Baixo");
            admin.setPlanType(PlanType.ISENTO_ADMIN);
            admin.setSubscriptionStatus(SubscriptionStatus.ISENTO);
            admin.setMonthlyFee(BigDecimal.ZERO);
            admin.setExpiresAt(LocalDateTime.of(2099, 12, 31, 23, 59));
            admin.setTenantId("tenant-default");

            usuarioRepository.save(admin);
            log.info(">> [DATABASE SEED] Administrador padrao criado com sucesso: {}", adminEmail);
        }
    }

    private void seedMusicos() {
        if (musicoRepository.count() == 0) {
            Musico m1 = new Musico();
            m1.setNome("Mauricio Oliveira");
            m1.setInstrumento("Contrabaixo / Produção");
            m1.setTelefone("(11) 99999-9999");
            m1.setEmail("mauriciogoulart.deoliveira37@gmail.com");
            m1.setCachePadrao(new BigDecimal("350.00"));
            m1.setChavePix("mauriciogoulart.deoliveira37@gmail.com");
            m1.setAtivo(true);
            m1.setTenantId("tenant-default");
            musicoRepository.save(m1);

            Musico m2 = new Musico();
            m2.setNome("Lucas Ribeiro");
            m2.setInstrumento("Voz Principal / Violão");
            m2.setTelefone("(11) 98888-8888");
            m2.setCachePadrao(new BigDecimal("350.00"));
            m2.setChavePix("lucas.voz@pix.com.br");
            m2.setAtivo(true);
            m2.setTenantId("tenant-default");
            musicoRepository.save(m2);

            Musico m3 = new Musico();
            m3.setNome("André Silveira");
            m3.setInstrumento("Guitarra Solo");
            m3.setTelefone("(11) 97777-7777");
            m3.setCachePadrao(new BigDecimal("350.00"));
            m3.setChavePix("andre.guitar@pix.com.br");
            m3.setAtivo(true);
            m3.setTenantId("tenant-default");
            musicoRepository.save(m3);

            Musico m4 = new Musico();
            m4.setNome("Felipe Teclados");
            m4.setInstrumento("Teclado & Synth");
            m4.setTelefone("(11) 96666-6666");
            m4.setCachePadrao(new BigDecimal("350.00"));
            m4.setChavePix("felipe.keys@pix.com.br");
            m4.setAtivo(true);
            m4.setTenantId("tenant-default");
            musicoRepository.save(m4);

            Musico m5 = new Musico();
            m5.setNome("Rodrigo Bateria");
            m5.setInstrumento("Bateria & Sampler");
            m5.setTelefone("(11) 95555-5555");
            m5.setCachePadrao(new BigDecimal("350.00"));
            m5.setChavePix("rodrigo.drums@pix.com.br");
            m5.setAtivo(true);
            m5.setTenantId("tenant-default");
            musicoRepository.save(m5);

            log.info(">> [DATABASE SEED] Formacao da banda (5 musicos) cadastrada!");
        }
    }

    private void seedRepertorio() {
        if (musicaRepository.count() == 0) {
            Musica mus1 = new Musica();
            mus1.setTitulo("Tempo Perdido");
            mus1.setArtista("Legião Urbana");
            mus1.setTom("C");
            mus1.setGenero("Pop Rock");
            mus1.setDuracao("4:15");
            mus1.setLinkCifra("https://www.cifraclub.com.br/legiao-urbana/tempo-perdido/");
            mus1.setObservacoes("Solo estendido no final; entrada direta na caixa da bateria.");
            mus1.setAtiva(true);
            mus1.setTenantId("tenant-default");
            musicaRepository.save(mus1);

            Musica mus2 = new Musica();
            mus2.setTitulo("Primeiros Erros");
            mus2.setArtista("Capital Inicial");
            mus2.setTom("G");
            mus2.setGenero("Pop Rock");
            mus2.setDuracao("3:45");
            mus2.setLinkCifra("https://www.cifraclub.com.br/capital-inicial/primeiros-erros/");
            mus2.setObservacoes("Entrada acústica; banda entra no segundo verso.");
            mus2.setAtiva(true);
            mus2.setTenantId("tenant-default");
            musicaRepository.save(mus2);

            Musica mus3 = new Musica();
            mus3.setTitulo("Evidências");
            mus3.setArtista("Chitãozinho & Xororó");
            mus3.setTom("E");
            mus3.setGenero("Sertanejo");
            mus3.setDuracao("4:30");
            mus3.setLinkCifra("https://www.cifraclub.com.br/chitaozinho-xororo/evidencias/");
            mus3.setObservacoes("Clássico obrigatório em casamentos e formaturas.");
            mus3.setAtiva(true);
            mus3.setTenantId("tenant-default");
            musicaRepository.save(mus3);

            log.info(">> [DATABASE SEED] Repertorio inicial semeado com sucesso!");
        }
    }

    private void seedEquipamentos() {
        if (equipamentoRepository.count() == 0) {
            EquipamentoLocacao eq1 = new EquipamentoLocacao();
            eq1.setCodigo("PA-01");
            eq1.setNome("Caixa Ativa RCF ART 715-A (15\" 1400W)");
            eq1.setCategoria("som_pa");
            eq1.setMarcaModelo("RCF / ART 715 MK4");
            eq1.setQuantidadeTotal(4);
            eq1.setQuantidadeDisponivel(4);
            eq1.setValorDiaria(new BigDecimal("180.00"));
            eq1.setEstado("excelente");
            eq1.setObservacoes("Acompanha cabo Powercon e capa protetora");
            eq1.setTenantId("tenant-default");
            equipamentoRepository.save(eq1);

            EquipamentoLocacao eq2 = new EquipamentoLocacao();
            eq2.setCodigo("SUB-01");
            eq2.setNome("Subwoofer Ativo 18\" JBL SRX818SP (1000W RMS)");
            eq2.setCategoria("som_pa");
            eq2.setMarcaModelo("JBL / SRX818SP");
            eq2.setQuantidadeTotal(2);
            eq2.setQuantidadeDisponivel(2);
            eq2.setValorDiaria(new BigDecimal("250.00"));
            eq2.setEstado("excelente");
            eq2.setObservacoes("Potência e pressão para eventos médios e grandes");
            eq2.setTenantId("tenant-default");
            equipamentoRepository.save(eq2);

            EquipamentoLocacao eq3 = new EquipamentoLocacao();
            eq3.setCodigo("MIX-01");
            eq3.setNome("Mesa de Som Digital Behringer X32 Compact");
            eq3.setCategoria("mesa_som");
            eq3.setMarcaModelo("Behringer / X32 Compact");
            eq3.setQuantidadeTotal(1);
            eq3.setQuantidadeDisponivel(1);
            eq3.setValorDiaria(new BigDecimal("350.00"));
            eq3.setEstado("excelente");
            eq3.setObservacoes("Acompanha roteador Wi-Fi 5GHz para controle via iPad");
            eq3.setTenantId("tenant-default");
            equipamentoRepository.save(eq3);

            EquipamentoLocacao eq4 = new EquipamentoLocacao();
            eq4.setCodigo("MIC-01");
            eq4.setNome("Microfone Sem Fio Duplo Shure GLXD4 (Beta 58A)");
            eq4.setCategoria("microfones");
            eq4.setMarcaModelo("Shure / GLXD4 Beta 58A");
            eq4.setQuantidadeTotal(2);
            eq4.setQuantidadeDisponivel(2);
            eq4.setValorDiaria(new BigDecimal("150.00"));
            eq4.setEstado("excelente");
            eq4.setObservacoes("Baterias recarregáveis inclusas");
            eq4.setTenantId("tenant-default");
            equipamentoRepository.save(eq4);

            log.info(">> [DATABASE SEED] Equipamentos da Locadora de Som semeados!");
        }
    }
}
