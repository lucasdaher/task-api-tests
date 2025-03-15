# Gerenciamento de Tarefas
Este projeto consiste em uma API REST completa para gerenciamento de tarefas, desenvolvida para a matéria de Testes de Software.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript
- **Express**: Framework web para Node.js
- **MySQL**: Banco de dados relacional
- **Sequelize**: ORM para bancos de dados relacionais
- **Jest**: Framework de testes
- **Supertest**: Biblioteca para testes de API
- **SQLite**: Banco de dados em memória para testes

## Estrutura

```
task-api-tests/
  ├── src/
  │   ├── config/
  │   │   └── database.js
  │   ├── controllers/
  │   │   └── taskController.js
  │   ├── models/
  │   │   ├── index.js
  │   │   └── task.js
  │   ├── routes/
  │   │   └── taskRoutes.js
  │   ├── services/
  │   │   └── taskService.js
  │   └── app.js
  ├── tests/
  │   ├── unit/
  │   │   └── taskService.test.js
  │   ├── integration/
  │   │   └── taskApi.test.js
  │   ├── e2e/
  │   │   └── task.test.js
  │   └── setup.js
  ├── setup-database.sql
  ├── package.json
  ├── jest.config.js
  ├── .env.example
  └── README.md
```

## Instalação e configuração

1. **Clone este repositório**:
   ```bash
   git clone https://github.com/lucasdaher/task-api-tests.git
   cd task-api-tests
   ```

2. **Instale as dependências**:
   ```bash
   yarn install
   ```

3. **Configure o banco de dados MySQL**:
   - Certifique-se de ter o MySQL instalado e em execução
   - Use o MySQL Workbench ou o terminal para executar o script `setup-database.sql`:
     ```bash
     mysql -u root -p < setup-database.sql
     ```
   - Ou copie e cole o conteúdo do arquivo no MySQL Workbench e execute

4. **Configure as variáveis de ambiente**:
   - Copie o arquivo `.env.example` para `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edite o arquivo `.env` com suas configurações do MySQL:
     ```
     DB_USER=root
     DB_PASSWORD=sua_senha_aqui
     DB_NAME=task_api_tests
     DB_HOST=localhost
     DB_PORT=3306
     ```

5. **Inicie o servidor**:
   ```bash
   yarn start
   ```
   
   Ou para desenvolvimento com hot-reload:
   ```bash
   yarn run dev
   ```

## Endpoints

### Tarefas

| Método | URL | Descrição |
|--------|-----|-----------|
| GET | /api/tasks | Lista todas as tarefas |
| GET | /api/tasks/:id | Obtém uma tarefa específica |
| POST | /api/tasks | Cria uma nova tarefa |
| PUT | /api/tasks/:id | Atualiza uma tarefa existente |
| PATCH | /api/tasks/:id/status | Atualiza o status de uma tarefa |
| DELETE | /api/tasks/:id | Remove uma tarefa |

### Exemplos de Requisições

#### Criar uma tarefa

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implementar testes",
    "description": "Implementar testes unitários e de integração",
    "priority": "alta"
  }'
```

#### Listar todas as tarefas

```bash
curl -X GET http://localhost:3000/api/tasks
```

#### Atualizar status de uma tarefa

```bash
curl -X PATCH http://localhost:3000/api/tasks/[ID]/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "concluída"
  }'
```

## Testes

### Executando os testes

Para executar todos os testes:
```bash
yarn test
```

Para executar testes específicos:
```bash
yarn run test:unit        # Testes unitários
yarn run test:integration # Testes de integração
yarn run test:e2e         # Testes end-to-end
```

Para gerar relatório de cobertura:
```bash
yarn run test:coverage
```

### Tipos de Testes Implementados

1. **Testes Unitários**
   - Testam isoladamente os serviços e funções da aplicação
   - Utilizam SQLite em memória para simular o banco de dados

2. **Testes de Integração**
   - Testam a integração entre controllers, services e routes
   - Verificam se a API responde corretamente a diferentes requisições

3. **Testes End-to-End (E2E)**
   - Testam fluxos completos da aplicação
   - Simulam o uso real da API por parte dos usuários

## Modelo de Dados

### Tabela `tasks`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | Identificador único, autoincremento (chave primária) |
| title | VARCHAR(100) | Título da tarefa (obrigatório) |
| description | TEXT | Descrição detalhada da tarefa (opcional) |
| status | ENUM | Estado da tarefa: 'pendente', 'em andamento', 'concluída' |
| priority | ENUM | Prioridade da tarefa: 'baixa', 'média', 'alta' |
| due_date | DATETIME | Data de vencimento da tarefa (opcional) |
| created_at | DATETIME | Data de criação do registro |
| updated_at | DATETIME | Data da última atualização do registro |

### Documentação dos Testes

Todos os testes são documentados no arquivo de [Documentação de Testes](./tests/DOCUMENTATION.md), que inclui:

- Estratégia de testes adotada
- Detalhamento dos casos de teste
- Resultados dos testes
- Análise de cobertura
- Recomendações para melhorias

## Problemas que podem acontecer

1. **Erro de conexão com MySQL**
   - Verifique se o serviço MySQL está em execução
   - Confirme as credenciais no arquivo `.env`
   - Certifique-se de que o banco de dados `task_api_tests` existe

2. **Erro de sincronização de modelos**
   - Verifique se as permissões do usuário do banco são adequadas
   - Tente usar `{ force: true }` na primeira execução para criar as tabelas
   - Verifique os logs de erro para mensagens específicas do MySQL

3. **Falha nos testes**
   - Certifique-se de que o SQLite está instalado corretamente
   - Verifique se há problemas de versão com as dependências
   - Use `--verbose` para ver detalhes: `yarn test -- --verbose`