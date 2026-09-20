# StageFlow

Sistema de gestão de bandas e músicos — organize bandas, músicos, eventos, agenda e repertório em um só lugar.

## ✨ Sobre o projeto

O StageFlow é uma aplicação web para ajudar bandas e músicos a organizarem sua rotina: cadastro de bandas e integrantes, controle de eventos e agenda, e gerenciamento de repertório.

## 🚀 Tecnologias

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)

## 📁 Estrutura do projeto

```
stageflow/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Button/
│   │   ├── Input/
│   │   └── Logo/
│   ├── contexts/
│   ├── hooks/
│   ├── layouts/
│   │   ├── AuthLayout/
│   │   └── DashboardLayout/
│   ├── pages/
│   │   ├── Login/
│   │   ├── Dashboard/
│   │   ├── Bandas/
│   │   ├── Musicos/
│   │   ├── Eventos/
│   │   ├── Agenda/
│   │   ├── Repertorio/
│   │   └── Configuracoes/
│   ├── routes/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 📄 Páginas

| Página | Descrição |
|---|---|
| Login | Autenticação do usuário |
| Dashboard | Visão geral do sistema |
| Bandas | Cadastro e gestão de bandas |
| Musicos | Cadastro e gestão de músicos |
| Eventos | Cadastro e gestão de eventos |
| Agenda | Visualização de compromissos e datas |
| Repertorio | Gestão do repertório musical |
| Configuracoes | Configurações da conta/sistema |

## 🔧 Como rodar o projeto

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/stageflow.git

# Entrar na pasta do projeto
cd stageflow

# Instalar as dependências
npm install

# Rodar em modo de desenvolvimento
npm run dev
```

## 🗺️ Roadmap de desenvolvimento

- [x] Estrutura de pastas do projeto
- [ ] Etapa 1 — Types e utils (entidades do domínio: Banda, Músico, Evento, etc.)
- [ ] Etapa 2 — Componentes base (Button, Input, Logo)
- [ ] Etapa 3 — Layouts (Auth e Dashboard)
- [ ] Etapa 4 — Páginas e rotas
- [ ] Etapa 5 — Integração com serviços/API

## 📝 Licença

Este projeto está sob a licença que você definir (MIT, por exemplo).
