<div align="center">

# 🎛️ StageFlow • Band & Stage Management Platform

**Plataforma Progressive Web App (PWA) para Gestão Completa de Bandas, Propostas Comerciais, Contratos e Operação de Palco.**

[![React 19](https://img.shields.io/badge/React-19.2-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![License MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](./LICENSE)
[![Deploy Status](https://img.shields.io/badge/Deploy-GitHub_Pages-success?style=for-the-badge&logo=github)](https://mauricio-g-oliveira.github.io/stageflow/)

<br />

### 🚀 [Acessar Demonstração Online (Live Demo)](https://mauricio-g-oliveira.github.io/stageflow/)

<br />

</div>

---

## 📖 Visão Geral do Projeto

O **StageFlow** é uma solução moderna e profissional desenvolvida para transformar a rotina artística, operacional e comercial de bandas musicais independentes e de eventos corporativos/sociais.

Construído com foco em **alta disponibilidade**, o sistema funciona como um **Progressive Web App (PWA)** instalável no celular (iOS / Android) e no computador (Windows / macOS / Linux), operando com arquitetura **Offline-First** para que líderes de banda, músicos e equipe técnica possam consultar contratos, orçamentos e repertório mesmo em locais sem sinal de internet ou bastidores de eventos.

---

## ⚡ Principais Funcionalidades

### 💼 1. Gestão Comercial & Orçamentos Instantâneos (`/orcamentos`)
- Criação rápida de propostas personalizadas por cliente com cálculo automático de sinal (reserva de data) e saldo restante.
- Numeração automática sequencial (`ORC-2026/001`).
- Envio instantâneo formatado em **1 clique para o WhatsApp** do contratante.
- Conversão direta da proposta aprovada em Contrato de Prestação de Serviços sem retrabalho de digitação.

### 📜 2. Motor de Contratos com Nomeação Inteligente de PDF (`/contratos`)
- Modelos contratuais personalizáveis com cláusulas dinâmicas (horários de montagem, passagem de som, alimentação e penalidades por atraso).
- **Nomeação Automática ao Salvar em PDF**: o sistema altera dinamicamente os metadados do documento no navegador para que o arquivo gerado seja salvo automaticamente com o nome limpo do cliente e data (ex: `Contrato - João da Silva - 20-11-2026.pdf`).
- Suporte para exportação dos dados em JSON estruturado para arquivamento.

### 🎸 3. Press Kit Oficial & Central de Mídia no Google Drive (`/presskit`)
- **Aba de Apresentação Comercial:** vitrine visual no estilo *Banda Livert*, destacando foto oficial de divulgação, biografia/release, integrantes da banda e destaques de repertório.
- **Hub do Google Drive Integrado:** botão direto de 1 clique para contratantes e produtores baixarem vídeos ao vivo dos shows, fotos em alta resolução, logotipo transparente e artes para flyers.
- **Rider Técnico Separado:** aba isolada contendo mapa de canais da mesa de som (*Input List* de 1 a 12), especificações de sistema de P.A., vias de monitoração por fone *In-Ear* e requisitos elétricos — destinado exclusivamente para shows onde a sonorização é contratada de terceiros.

### 📦 4. Inventário de Som & Equipamentos Patrimoniais (`/equipamentos`)
- Registro de todos os ativos de áudio, iluminação e instrumentos próprios da banda.
- Controle de data de aquisição, valor de compra, modalidade de pagamento e pagador (ex: Caixa da Banda vs. investimento individual de integrantes).
- Cards com indicadores de valor total investido e itens ativos em palco.

### 👥 5. Gestão de Músicos & Equipe Técnica (`/musicos`)
- Organização dos integrantes em palco (Voz, Guitarra, Baixo, Bateria) e suporte técnico (Roadie, Técnicos de Som e Luz).
- Acompanhamento de cachês e status de participação por evento.

### 🌓 6. Tema Adaptativo Dark & Light Mode
- **Modo Escuro (Dark):** paleta de contraste calibrada para visualização noturna em ambientes de palco e baixa luminosidade.
- **Modo Claro (Light):** inversão automática e suave de variáveis Slate no Tailwind CSS v4, garantindo legibilidade perfeita para uso diurno em escritório e envio para clientes.

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Propósito |
|---|---|---|
| **Linguagem** | TypeScript 6.0 | Tipagem estática estrita, interfaces de domínio e segurança em tempo de compilação |
| **Framework UI** | React 19 | Criação de interfaces reativas, componentes funcionais e renderização moderna |
| **Estilização** | Tailwind CSS v4 | Estilização utilitária de alta performance com Lightning CSS engine e variáveis dinâmicas |
| **Build & Bundler** | Vite 8 + Rollup | Compilação ultrarrápida, Hot Module Replacement (HMR) e otimização de bundles |
| **PWA & Offline** | Vite Plugin PWA + Workbox | Service Worker, manifesto web e experiência de aplicativo nativo |
| **Documentos** | JSZip + Print API | Processamento de arquivos docx de repertório e automação de exportação PDF |
| **Ícones** | Lucide React | Conjunto visual moderno e consistente |
| **Deploy & CI/CD** | GitHub Pages + Git Flow | Hospedagem automatizada e controle de versão corporativo |

---

## 🌿 Estrutura de Branches & Governança (Git Flow)

Este repositório adota as melhores práticas de versionamento da indústria:

```
main (Produção estável / Deploy)
  │
  ├── develop (Integração contínua e novas versões)
  │     │
  │     ├── feature/presskit-rider-tabs
  │     ├── feature/pdf-automatic-naming
  │     └── feature/financial-expansion
  │
  └── tags: v1.0.0, v1.1.0, v1.2.0
```

- **`main`**: branch de produção estável refletida no ambiente ao vivo.
- **`develop`**: branch onde os desenvolvimentos em andamento são consolidados antes de novas releases.
- **`feature/*`**: branches pontuais para novas funcionalidades isoladas.
- **Tags de Release (SemVer):** versionamento semântico padronizado (`v1.0.0`, `v1.1.0`, `v1.2.0`).

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 18+ ou superior
- Gerenciador de pacotes `npm` ou `pnpm`

### Passo a passo

```bash
# 1. Clonar o repositório
git clone https://github.com/Mauricio-G-Oliveira/stageflow.git

# 2. Entrar na pasta do projeto
cd stageflow

# 3. Instalar as dependências
npm install

# 4. Iniciar o servidor de desenvolvimento
npm run dev
```

Abra o navegador em `http://localhost:5173` para visualizar a aplicação rodando.

### Comandos de Build e Qualidade

```bash
# Executar a compilação de produção e validação de types
npm run build

# Executar o linter de código (Oxlint)
npm run lint

# Fazer o deploy para o GitHub Pages
npm run deploy
```

---

## 📂 Estrutura de Pastas do Projeto

```
stageflow/
├── public/                  # Ícones, manifestos PWA e assets estáticos
├── src/
│   ├── components/          # Componentes reutilizáveis (Button, Input, Logo, Modais)
│   ├── contexts/            # Contextos globais (AuthContext, ThemeContext)
│   ├── hooks/               # Custom hooks (PWA install, media queries)
│   ├── layouts/             # Layouts mestres (DashboardLayout, AuthLayout)
│   ├── pages/               # Módulos de tela da aplicação
│   │   ├── Agenda/          # Calendário e passagens de som
│   │   ├── Configuracoes/   # Dados de contato e tema
│   │   ├── Contratos/       # Modelos e visualizador com exportador de PDF
│   │   ├── Dashboard/       # Métricas de shows e faturamento
│   │   ├── Locadora/        # Inventário patrimonial de equipamentos
│   │   ├── Musicos/         # Músicos de palco e equipe técnica
│   │   ├── Orcamentos/      # Propostas comerciais com WhatsApp
│   │   ├── PressKit/        # Apresentação da banda & Rider Técnico
│   │   └── Repertorio/      # Setlists e cifras integradas
│   ├── services/            # Serviços de negócio com persistência LocalStorage
│   ├── types/               # Modelos e interfaces TypeScript
│   ├── utils/               # Utilitários (formatadores, printHelper)
│   ├── App.tsx              # Roteamento e providers principais
│   └── index.css            # Configuração de temas e CSS Tailwind v4
├── .github/                 # Templates de Pull Request e automações
├── LICENSE                  # Licença MIT
├── package.json             # Dependências e scripts
└── vite.config.ts           # Configurações do Vite e PWA
```

---

## 👤 Autor

**Maurício G. Oliveira**
- GitHub: [@Mauricio-G-Oliveira](https://github.com/Mauricio-G-Oliveira)
- Projeto: [StageFlow no GitHub Pages](https://mauricio-g-oliveira.github.io/stageflow/)

---

## 📄 Licença

Este projeto é distribuído sob a licença **MIT**. Consulte o arquivo [LICENSE](./LICENSE) para obter mais detalhes.
