<div align="center">

# ⚙️ StageFlow • Backend RESTful API

**Serviço Backend de Alta Performance em Java 21 LTS & Spring Boot 3 para o Ecossistema StageFlow.**

[![Java 21 LTS](https://img.shields.io/badge/Java-21_LTS-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot 3.3.4](https://img.shields.io/badge/Spring_Boot-3.3.4-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Spring Security & JWT](https://img.shields.io/badge/Security-JWT_Auth-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io/)
[![Docker](https://img.shields.io/badge/Docker-Container-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Maven](https://img.shields.io/badge/Maven-Build-C71A36?style=for-the-badge&logo=apache-maven&logoColor=white)](https://maven.apache.org/)
[![License MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](./LICENSE)

<br />

### 🌐 [Repositório Frontend (React 19 PWA)](https://github.com/Mauricio-G-Oliveira/stageflow) • [Live Demo Online](https://mauricio-g-oliveira.github.io/stageflow/)

<br />

</div>

---

## 📖 Visão Geral da API

O **StageFlow Backend** é a espinha dorsal de serviços RESTful da plataforma StageFlow. Projetado com padrões de arquitetura corporativa em camadas (*Layered Architecture*), ele fornece persistência robusta, controle de acesso baseado em papéis (RBAC), emissão de tokens JWT e gestão de recursos para bandas, eventos musicais, contratos e inventário patrimonial.

---

## 🏛️ Destaques de Arquitetura & Engenharia

- **Java 21 LTS & Spring Boot 3.3.4:** Aproveita os recursos modernos da linguagem Java com alta performance e suporte a virtual threads.
- **Autenticação Stateless com JWT:** Filtro customizado `JwtAuthenticationFilter` interceptando requisições HTTP Bearer com validação criptográfica.
- **Controle de Acesso RBAC:** Perfis `ADMIN` e `USER` protegendo rotas administrativas e financeiras com granularidade.
- **Camada de Isolamento com DTOs:** Entidades JPA (`@Entity`) nunca são expostas diretamente na API pública, garantindo desacoplamento e segurança contra *mass assignment*.
- **Estratégia de Banco de Dados Dual:**
  - **Desenvolvimento Local:** Suporte a banco em memória (**H2**) para execução instantânea sem necessidade de instalar banco local.
  - **Staging / Produção:** Conexão nativa com **PostgreSQL** em nuvem (Supabase, Neon, Render ou AWS RDS).
- **Seed Automatizado (`DatabaseSeeder`):** Inicialização do banco com dados realistas de teste, usuário administrador padrão e estruturas de show pré-configuradas.
- **Containerização com Docker:** `Dockerfile` pronto para orquestração em contêineres e deploy em plataformas PaaS (Render, Fly.io, Railway, AWS ECS).

---

## 📡 Referência dos Endpoints da API REST

Todas as rotas da API estão prefixadas sob `/api/v1`.

### 🔐 1. Autenticação & Gestão de Contas (`/auth`)
| Método | Endpoint | Proteção | Descrição |
|---|---|---|---|
| `POST` | `/api/v1/auth/login` | Pública | Autenticação com e-mail e senha. Retorna Token JWT e dados do perfil. |
| `POST` | `/api/v1/auth/register` | Pública | Cadastro de novo usuário com período de degustação (*Trial*). |
| `GET` | `/api/v1/auth/me` | JWT | Retorna informações do usuário atualmente autenticado. |

### 👥 2. Gestão de Usuários & Assinantes (`/usuarios`)
| Método | Endpoint | Proteção | Descrição |
|---|---|---|---|
| `GET` | `/api/v1/usuarios` | `ADMIN` | Listagem completa de usuários e status de plano. |
| `POST` | `/api/v1/usuarios/{id}/renovar` | `ADMIN` | Renovação manual de período de acesso de usuário. |
| `PATCH` | `/api/v1/usuarios/{id}/senha` | JWT | Atualização segura de senha. |
| `DELETE` | `/api/v1/usuarios/{id}` | `ADMIN` | Exclusão de conta de usuário. |

### 📅 3. Eventos, Shows & Cronograma de Palco (`/eventos`)
| Método | Endpoint | Proteção | Descrição |
|---|---|---|---|
| `GET` | `/api/v1/eventos` | JWT | Lista todos os shows e eventos cadastrados com horários e cachê. |
| `POST` | `/api/v1/eventos` | JWT | Cadastra novo show com detalhes de montagem, passagem de som e local. |
| `PUT` | `/api/v1/eventos/{id}` | JWT | Atualiza os dados de um evento existente. |
| `DELETE` | `/api/v1/eventos/{id}` | JWT | Remove um show da agenda. |

### 🎸 4. Músicos & Integrantes (`/musicos`)
| Método | Endpoint | Proteção | Descrição |
|---|---|---|---|
| `GET` | `/api/v1/musicos` | JWT | Lista os músicos da banda, instrumentos, dados de contato e chave PIX. |
| `POST` | `/api/v1/musicos` | JWT | Cadastra integrante da banda ou suporte técnico. |

### 🎶 5. Repertório & Cifras (`/repertorio`)
| Método | Endpoint | Proteção | Descrição |
|---|---|---|---|
| `GET` | `/api/v1/repertorio` | JWT | Lista as músicas do repertório com tom, BPM e cifras associadas. |
| `POST` | `/api/v1/repertorio` | JWT | Adiciona nova música e arranjos ao repertório da banda. |

### 📜 6. Contratos de Prestação de Serviços (`/contratos`)
| Método | Endpoint | Proteção | Descrição |
|---|---|---|---|
| `GET` | `/api/v1/contratos` | JWT | Lista todos os contratos gerados para clientes e contratantes. |
| `POST` | `/api/v1/contratos` | JWT | Emite novo contrato com cláusulas comerciais e valores. |

### 📦 7. Inventário Patrimonial & Locações (`/locadora`)
| Método | Endpoint | Proteção | Descrição |
|---|---|---|---|
| `GET` | `/api/v1/locadora/equipamentos` | JWT | Lista os ativos de som, iluminação e instrumentos cadastrados. |
| `POST` | `/api/v1/locadora/equipamentos` | JWT | Cadastra novo equipamento no patrimônio da banda. |
| `GET` | `/api/v1/locadora/locacoes` | JWT | Consulta agenda de locações ou cessões de equipamentos. |
| `POST` | `/api/v1/locadora/locacoes` | JWT | Registra saída de equipamentos e gera termo de locação. |

---

## 📁 Estrutura de Pacotes

```
backend/
├── src/main/java/com/stageflow/
│   ├── config/            # Configurações de CORS, WebMvc e Segurança
│   ├── controller/        # Controladores REST da API (@RestController)
│   ├── data/              # DatabaseSeeder para população inicial de dados
│   ├── domain/            # Entidades JPA e Enums de domínio
│   │   ├── entity/        # Contrato, Evento, Musico, Musica, Usuario, Equipamento
│   │   └── enums/         # Role, StatusEvento, StatusLocacao, PlanType
│   ├── dto/               # Data Transfer Objects para requests e responses
│   │   └── auth/          # LoginRequest, RegisterRequest, LoginResponse
│   ├── repository/        # Repositórios Spring Data JPA (@Repository)
│   ├── security/          # Provedores JWT, filtros e UserDetailsService
│   ├── service/           # Camada de lógica de negócios (@Service)
│   └── StageflowApplication.java # Classe principal do Spring Boot
├── src/main/resources/
│   └── application.yml    # Configuração de portas, JWT secret e datasource
├── Dockerfile             # Multi-stage build para produção
├── LICENSE                # Licença MIT
└── pom.xml                # Gerenciador de dependências Maven
```

---

## 🛠️ Como Executar Localmente

### Pré-requisitos
- **Java JDK 17 ou 21** instalado
- **Maven 3.8+** (ou utilize o plugin do IntelliJ IDEA / VS Code)

### Execução via Linha de Comando (Maven)

```bash
# 1. Entrar na pasta do backend
cd backend

# 2. Compilar e empacotar a aplicação
mvn clean package -DskipTests

# 3. Executar o JAR gerado
java -jar target/stageflow-backend-0.0.1-SNAPSHOT.jar
```

A API estará disponível em `http://localhost:8080`.

### Execução via Docker

```bash
# Construir a imagem Docker
docker build -t stageflow-backend .

# Executar o contêiner
docker run -p 8080:8080 stageflow-backend
```

---

## 🌿 Governança de Branches (Git Flow)

```
main (Produção / Release estável)
  │
  └── develop (Integração de novas features da API)
        │
        └── feature/nome-da-funcionalidade
```

- **`main`**: Versões estáveis e testadas.
- **`develop`**: Linha ativa de desenvolvimento da API.
- **Tags de Release (SemVer):** Versionamento semântico padronizado (`v1.0.0`).

---

## 👤 Autor

**Maurício G. Oliveira**
- GitHub: [@Mauricio-G-Oliveira](https://github.com/Mauricio-G-Oliveira)
- Repositório Frontend: [StageFlow PWA](https://github.com/Mauricio-G-Oliveira/stageflow)

---

## 📄 Licença

Este projeto é distribuído sob a licença **MIT**. Consulte o arquivo [LICENSE](./LICENSE) para mais detalhes.
