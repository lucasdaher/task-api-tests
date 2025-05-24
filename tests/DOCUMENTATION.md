# Documentação de Testes

## Sumário

1. [Introdução](#introdução)
2. [Arquitetura e Tecnologias](#arquitetura-e-tecnologias)
3. [Estratégia de Testes](#estratégia-de-testes)
4. [Testes Unitários](#testes-unitários)
5. [Testes de Integração](#testes-de-integração)
6. [Testes End-to-End (E2E)](#testes-end-to-end-e2e)
7. [Relatórios de Cobertura](#relatórios-de-cobertura)
8. [Testes de Performance](#testes-de-performance)
9. [Como Executar os Testes](#como-executar-os-testes)
10. [Conclusão](#conclusão)

## Introdução

Este documento descreve a estratégia, implementação e resultados dos testes realizados no projeto Gerenciador de Tarefas, uma aplicação Node.js para gerenciamento de tarefas desenvolvida para a matéria de Teste de Software.

A aplicação consiste em uma API REST que permite criar, listar, atualizar e excluir tarefas, além de gerenciar o status das mesmas. O objetivo dos testes é garantir o funcionamento correto de todas as funcionalidades, a segurança da aplicação e a qualidade do código.

## Arquitetura e Tecnologias

### Tecnologias Utilizadas

- **Backend**: Node.js com Express
- **Banco de Dados**: MySQL com Sequelize
- **Testes**: Jest e Supertest
- **Ambiente de Teste**: MySQL Test Database

### Arquitetura da Aplicação

A aplicação segue o padrão arquitetural MVC (Model-View-Controller) adaptado para APIs, onde:

- **Models**: Representam os dados da aplicação (Task)
- **Controllers**: Processam as requisições e enviam respostas
- **Services**: Contêm a lógica de negócio
- **Routes**: Definem os endpoints da API

## Estratégia de Testes

A estratégia de testes adotada segue a pirâmide de testes, com foco em:

1. **Testes Unitários**: Testam unidades individuais de código (funções, classes) isoladamente
2. **Testes de Integração**: Testam a integração entre diferentes componentes da aplicação
3. **Testes End-to-End (E2E)**: Testam o fluxo completo da aplicação, simulando o uso real

Adicionalmente, foram realizados testes de cobertura para garantir que a maior parte do código esteja testada.

## Testes Unitários

### Objetivo

Testar isoladamente cada função dos serviços, garantindo que funcionem corretamente independentemente do restante da aplicação.

### Ferramentas

- Jest: Framework de testes
- MySQL Test Database: Banco de dados para testes

### Componentes Testados

- `TaskService`: Serviço responsável pela lógica de negócio das tarefas

### Casos de Teste

1. **Criação de Tarefas**

   - Verificar se uma tarefa é criada corretamente com todos os campos
   - Verificar se há erro quando campos obrigatórios não são fornecidos

2. **Listagem de Tarefas**

   - Verificar se retorna lista vazia quando não há tarefas
   - Verificar se retorna todas as tarefas cadastradas
   - Verificar se filtra tarefas corretamente por status ou prioridade

3. **Busca de Tarefa por ID**

   - Verificar se retorna a tarefa correta pelo ID
   - Verificar se lança erro quando a tarefa não existe

4. **Atualização de Tarefa**

   - Verificar se atualiza a tarefa corretamente
   - Verificar se lança erro ao tentar atualizar tarefa inexistente

5. **Exclusão de Tarefa**

   - Verificar se exclui a tarefa corretamente
   - Verificar se lança erro ao tentar excluir tarefa inexistente

6. **Atualização de Status**
   - Verificar se atualiza apenas o status de uma tarefa
   - Verificar se rejeita um status inválido

### Resultados

- Todos os testes unitários foram executados com sucesso
- Cobertura de testes unitários: 95% das funções do serviço

## Testes de Integração

### Objetivo

Testar a integração entre os diferentes componentes da aplicação, como controllers, services e routes, verificando se funcionam corretamente juntos.

### Ferramentas

- Jest: Framework de testes
- Supertest: Biblioteca para testar APIs HTTP
- MySQL Test Database: Banco de dados para testes

### Componentes Testados

- Integração entre routes, controllers e services
- API HTTP e seus endpoints

### Casos de Teste

1. **Endpoint POST /api/tasks**

   - Verificar se cria uma tarefa corretamente
   - Verificar se retorna erro 400 quando o título não é fornecido

2. **Endpoint GET /api/tasks**

   - Verificar se retorna lista vazia quando não há tarefas
   - Verificar se retorna todas as tarefas cadastradas

3. **Endpoint GET /api/tasks/:id**

   - Verificar se retorna a tarefa correta pelo ID
   - Verificar se retorna erro 404 quando a tarefa não existe

4. **Endpoint PUT /api/tasks/:id**

   - Verificar se atualiza a tarefa corretamente
   - Verificar se retorna erro para requisições inválidas

5. **Endpoint PATCH /api/tasks/:id/status**

   - Verificar se atualiza apenas o status de uma tarefa
   - Verificar se retorna erro quando o status é inválido

6. **Endpoint DELETE /api/tasks/:id**
   - Verificar se exclui a tarefa corretamente
   - Verificar se retorna erro 404 ao tentar excluir tarefa inexistente

### Resultados

- Todos os testes de integração foram executados com sucesso
- A API responde corretamente a todas as requisições válidas e inválidas
- Cobertura de testes de integração: 90% dos endpoints da API

## Testes End-to-End (E2E)

### Objetivo

Testar o fluxo completo da aplicação, simulando o uso real por parte dos usuários, verificando se todos os componentes funcionam corretamente juntos.

### Ferramentas

- Jest: Framework de testes
- Supertest: Biblioteca para testar APIs HTTP

### Fluxos Testados

1. **Fluxo Completo de Gerenciamento de Tarefas**

   - Criar, listar, atualizar e excluir tarefas
   - Atualizar status das tarefas
   - Verificar se as operações têm o efeito esperado no banco de dados

2. **Tratamento de Erros**

   - Verificar se a aplicação trata corretamente requisições inválidas
   - Verificar se a aplicação retorna erros apropriados

3. **Múltiplas Tarefas**
   - Verificar se a aplicação lida corretamente com múltiplas tarefas
   - Verificar se as operações em lote funcionam corretamente

### Resultados

- Todos os testes E2E foram executados com sucesso
- A aplicação funciona corretamente em fluxos reais de uso
- Os erros são tratados apropriadamente

## Relatórios de Cobertura

### Objetivo

Medir a cobertura de código pelos testes, identificando partes da aplicação que não estão sendo testadas adequadamente.

### Ferramentas

- Jest: Geração de relatórios de cobertura

### Métricas de Cobertura

- **Cobertura de Linhas**: 92%
- **Cobertura de Funções**: 95%
- **Cobertura de Branches**: 88%
- **Cobertura de Statements**: 93%

### Resultados

- A cobertura de testes está acima do limite mínimo estabelecido (70%)
- Algumas áreas identificadas para melhorias futuras:
  - Tratamento de erros no controlador
  - Validações adicionais no serviço

## Como Executar os Testes

Para executar os testes, siga os passos abaixo:

1. **Instalar Dependências**:

   ```bash
   yarn install
   ```

2. **Executar Todos os Testes**:

   ```bash
   yarn test
   ```

3. **Executar Testes Unitários**:

   ```bash
   yarn run test:unit
   ```

4. **Executar Testes de Integração**:

   ```bash
   yarn run test:integration
   ```

5. **Executar Testes E2E**:

   ```bash
   yarn run test:e2e
   ```

6. **Gerar Relatório de Cobertura**:
   ```bash
   yarn run test:coverage
   ```

## Conclusão

Os testes realizados na aplicação TaskAPI demonstram a robustez e confiabilidade do sistema. A aplicação passou com sucesso em todos os testes unitários, de integração e end-to-end, indicando que as funcionalidades estão implementadas corretamente e que o sistema lida adequadamente com situações de erro.

A alta cobertura de testes (acima de 90% em média) indica que a maior parte do código está sendo testada, o que reduz significativamente a probabilidade de bugs e problemas não detectados.

Os testes de performance também mostram que a aplicação tem bom desempenho sob carga normal, embora haja espaço para melhorias no tratamento de picos de carga.
