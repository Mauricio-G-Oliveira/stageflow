# StageFlow — Backend REST API (Java Spring Boot 3 & PostgreSQL)

Backend completo para o ecossistema **StageFlow**, desenvolvido em **Java 17 / 21 LTS**, **Spring Boot 3.3.4**, **Spring Data JPA**, **Spring Security**, **JWT** e **PostgreSQL**.

---

## 🚀 Como abrir e rodar no IntelliJ IDEA

1. Abra o **IntelliJ IDEA**.
2. Clique em **File > Open** (ou *Open Project*) e selecione esta pasta:
   ```
   /Users/mauricio/Desktop/stageflow/backend
   ```
3. O IntelliJ detectará automaticamente o arquivo `pom.xml` como projeto Maven e baixará todas as dependências.
4. Abra o arquivo principal:
   ```
   src/main/java/com/stageflow/StageflowApplication.java
   ```
5. Clique com o botão direito e selecione **Run 'StageflowApplication'** (ou clique no ícone verde ▶️).
6. **Pronto!** O backend iniciará na porta `8080`.
   - Se você ainda não tiver o PostgreSQL instalado localmente, o backend roda automaticamente em memória (**H2**) para você poder testar e debugar imediatamente sem erros de conexão!

---

## 🗄️ Conectando com o PostgreSQL na Nuvem (Supabase / Render / Neon - 100% Grátis)

Para conectar o backend com o seu banco PostgreSQL gratuito na nuvem, basta definir as variáveis de ambiente no IntelliJ (*Run/Debug Configurations*) ou no seu servidor de hospedagem:

```bash
SPRING_DATASOURCE_URL=jdbc:postgresql://db.seu-projeto.supabase.co:5432/postgres
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=sua-senha-do-banco
SPRING_DATASOURCE_DRIVER=org.postgresql.Driver
```

---

## 🔐 Administrador do Sistema

Ao iniciar a aplicação pela primeira vez, o `DatabaseSeeder` cria automaticamente a conta de Administrador oficial:

- **E-mail:** `mauriciogoulart.deoliveira37@gmail.com`
- **Perfil:** `ADMIN` (Isento e Vitalício)
- **Credenciais:** Gerenciadas de forma restrita e segura pelo proprietário do sistema.

---

## 📡 Principais Endpoints da API REST

### Autenticação & SaaS
- `POST /api/v1/auth/login`: Autentica com e-mail/senha e retorna token JWT.
- `POST /api/v1/auth/register`: Cadastra novos usuários/clientes com opção de 30 dias ou 3 dias de teste grátis.
- `GET /api/v1/auth/me`: Retorna os dados do usuário autenticado.

### Gestão SaaS de Assinantes & Usuários
- `GET /api/v1/usuarios`: Lista todos os usuários e status de assinatura (Admin).
- `POST /api/v1/usuarios/{id}/renovar`: Renova acesso por mais 30 dias após confirmação de pagamento PIX.
- `PATCH /api/v1/usuarios/{id}/senha`: Altera senha do usuário.
- `DELETE /api/v1/usuarios/{id}`: Remove usuário.

### Eventos & Shows
- `GET /api/v1/eventos`: Lista shows e eventos agendados com cronograma de palco e rateio.
- `POST /api/v1/eventos`: Cadastra novo evento.
- `PUT /api/v1/eventos/{id}`: Atualiza evento.
- `DELETE /api/v1/eventos/{id}`: Exclui evento.

### Músicos da Banda
- `GET /api/v1/musicos`: Lista músicos, instrumentos, cachês e chaves PIX.
- `POST /api/v1/musicos`: Cadastra músico.

### Repertório & Partituras
- `GET /api/v1/repertorio`: Lista músicas, tons, cifras e documentos anexados.
- `POST /api/v1/repertorio`: Cadastra música com cifras e anotações.

### Contratos
- `GET /api/v1/contratos`: Lista contratos emitidos para casamentos e festas.
- `POST /api/v1/contratos`: Emite novo contrato.

### Locadora de Som & Equipamentos
- `GET /api/v1/locadora/equipamentos`: Inventário de som, iluminação e estruturas.
- `POST /api/v1/locadora/equipamentos`: Cadastra equipamento no estoque.
- `GET /api/v1/locadora/locacoes`: Agenda de locações de equipamentos.
- `POST /api/v1/locadora/locacoes`: Registra locação e emite contrato.
- `PATCH /api/v1/locadora/locacoes/{id}/status`: Atualiza status da locação.

---

## 📦 Como criar um repositório separado no GitHub para o Backend

Recomendamos manter o backend em um repositório exclusivo (ex: `stageflow-backend`):

1. Crie um novo repositório vazio no seu GitHub com o nome `stageflow-backend`.
2. No seu terminal, entre na pasta `backend`:
   ```bash
   cd /Users/mauricio/Desktop/stageflow/backend
   git init
   git add .
   git commit -m "feat: backend inicial spring boot com postgresql e jwt"
   git branch -M main
   git remote add origin https://github.com/Mauricio-G-Oliveira/stageflow-backend.git
   git push -u origin main
   ```
