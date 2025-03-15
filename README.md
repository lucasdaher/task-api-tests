# Gerenciamento de Tarefas
Este projeto consiste em uma API REST completa para gerenciamento de tarefas, desenvolvida para a matéria de Testes de Software.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript
- **Express**: Framework web para Node.js
- **MongoDB**: Banco de dados NoSQL
- **Mongoose**: ODM para MongoDB
- **Jest**: Framework de testes
- **Supertest**: Biblioteca para testes de API
- **MongoDB Memory Server**: Banco de dados em memória para testes

## Estrutura

```
task-api-tests/
  ├── src/
  │   ├── controllers/
  │   │   └── taskController.js
  │   ├── models/
  │   │   └── Task.js
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
  │   └── e2e/
  │       └── task.test.js
  ├── package.json
  ├── .gitignore
  ├── yarn.lock
  ├── jest.config.js
  └── README.md
```

## Instalando e configurando

1. Clone este repositório:
   ```bash
   git clone https://github.com/lucasdaher/task-api-tests.git
   cd task-api-tests
   ```

2. Instale as dependências: (É necessário possuir o gerenciador de pacotes **YARN**)
   ```bash
   yarn install
   ```

3. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:
   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/todo_app
   ```

4. Inicie o servidor:
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
   - Utilizam um banco de dados em memória para simular o MongoDB

2. **Testes de Integração**
   - Testam a integração entre controllers, services e routes
   - Verificam se a API responde corretamente a diferentes requisições

3. **Testes End-to-End (E2E)**
   - Testam fluxos completos da aplicação
   - Simulam o uso real da API por parte dos usuários

4. **Relatórios de Cobertura**
   - Medem a porcentagem de código coberta pelos testes
   - Identificam áreas que precisam de mais testes

### Documentação dos Testes

Todos os testes são documentados no arquivo de [Documentação de Testes](./tests/DOCUMENTATION.md), que inclui:

- Estratégia de testes adotada
- Detalhamento dos casos de teste
- Resultados dos testes
- Análise de cobertura
- Recomendações para melhorias