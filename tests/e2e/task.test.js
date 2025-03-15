const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { app, connectDB } = require("../../src/app");
const Task = require("../../src/models/Task");

let mongoServer;
let createdTaskId;

// Configuração do ambiente de teste
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGO_URI = uri;
  await connectDB();
});

// Limpeza do ambiente após os testes
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Limpeza do banco de dados antes dos testes e2e
beforeAll(async () => {
  await Task.deleteMany({});
});

describe("E2E - Fluxo completo de gerenciamento de tarefas", () => {
  // Dados de exemplo para os testes
  const newTask = {
    title: "Implementar testes E2E",
    description: "Criar testes end-to-end para a aplicação de tarefas",
    priority: "alta",
  };

  const updatedTask = {
    title: "Implementar testes E2E - Atualizado",
    description:
      "Criar testes end-to-end para a aplicação de tarefas - Atualizado",
    priority: "média",
  };

  // Fluxo de teste completo
  it("deve permitir criar, listar, atualizar e excluir tarefas", async () => {
    // 1. Inicialmente não deve haver tarefas
    const initialResponse = await request(app)
      .get("/api/tasks")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(initialResponse.body).toEqual([]);

    // 2. Criar uma nova tarefa
    const createResponse = await request(app)
      .post("/api/tasks")
      .send(newTask)
      .expect("Content-Type", /json/)
      .expect(201);

    expect(createResponse.body).toHaveProperty("_id");
    expect(createResponse.body.title).toBe(newTask.title);
    expect(createResponse.body.status).toBe("pendente"); // Status padrão

    createdTaskId = createResponse.body._id;

    // 3. Verificar se a tarefa foi criada corretamente
    const getResponse = await request(app)
      .get(`/api/tasks/${createdTaskId}`)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(getResponse.body._id).toBe(createdTaskId);
    expect(getResponse.body.title).toBe(newTask.title);

    // 4. Atualizar a tarefa para "em andamento"
    const updateStatusResponse = await request(app)
      .patch(`/api/tasks/${createdTaskId}/status`)
      .send({ status: "em andamento" })
      .expect("Content-Type", /json/)
      .expect(200);

    expect(updateStatusResponse.body.status).toBe("em andamento");
    expect(updateStatusResponse.body._id).toBe(createdTaskId);

    // 5. Atualizar informações da tarefa
    const updateResponse = await request(app)
      .put(`/api/tasks/${createdTaskId}`)
      .send(updatedTask)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(updateResponse.body.title).toBe(updatedTask.title);
    expect(updateResponse.body.description).toBe(updatedTask.description);
    expect(updateResponse.body.priority).toBe(updatedTask.priority);
    expect(updateResponse.body.status).toBe("em andamento"); // Status não deve ter sido alterado

    // 6. Finalizar a tarefa
    const completeResponse = await request(app)
      .patch(`/api/tasks/${createdTaskId}/status`)
      .send({ status: "concluída" })
      .expect("Content-Type", /json/)
      .expect(200);

    expect(completeResponse.body.status).toBe("concluída");

    // 7. Excluir a tarefa
    const deleteResponse = await request(app)
      .delete(`/api/tasks/${createdTaskId}`)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(deleteResponse.body).toHaveProperty("message");
    expect(deleteResponse.body.message).toBe("Tarefa removida com sucesso");

    // 8. Verificar se a tarefa foi realmente excluída
    const verifyDeleteResponse = await request(app)
      .get(`/api/tasks/${createdTaskId}`)
      .expect("Content-Type", /json/)
      .expect(404);

    expect(verifyDeleteResponse.body).toHaveProperty("error");
  });

  it("deve retornar erros apropriados para requisições inválidas", async () => {
    // 1. Tentar criar uma tarefa sem título (campo obrigatório)
    const invalidTaskResponse = await request(app)
      .post("/api/tasks")
      .send({ description: "Tarefa sem título" })
      .expect("Content-Type", /json/)
      .expect(400);

    expect(invalidTaskResponse.body).toHaveProperty("error");

    // 2. Tentar acessar uma tarefa inexistente
    const nonExistentId = new mongoose.Types.ObjectId();
    const nonExistentResponse = await request(app)
      .get(`/api/tasks/${nonExistentId}`)
      .expect("Content-Type", /json/)
      .expect(404);

    expect(nonExistentResponse.body).toHaveProperty("error");

    // 3. Tentar atualizar o status para um valor inválido
    // Primeiro, criar uma tarefa para testar
    const tempTask = await request(app)
      .post("/api/tasks")
      .send(newTask)
      .expect(201);

    const tempTaskId = tempTask.body._id;

    const invalidStatusResponse = await request(app)
      .patch(`/api/tasks/${tempTaskId}/status`)
      .send({ status: "status_invalido" })
      .expect("Content-Type", /json/)
      .expect(400);

    expect(invalidStatusResponse.body).toHaveProperty("error");

    // Limpar a tarefa criada para o teste
    await request(app).delete(`/api/tasks/${tempTaskId}`).expect(200);
  });

  it("deve lidar corretamente com múltiplas tarefas", async () => {
    // 1. Criar várias tarefas
    const task1 = await request(app)
      .post("/api/tasks")
      .send({ title: "Tarefa 1", priority: "baixa" })
      .expect(201);

    const task2 = await request(app)
      .post("/api/tasks")
      .send({ title: "Tarefa 2", priority: "média" })
      .expect(201);

    const task3 = await request(app)
      .post("/api/tasks")
      .send({ title: "Tarefa 3", priority: "alta" })
      .expect(201);

    // 2. Verificar se todas as tarefas foram criadas
    const listResponse = await request(app).get("/api/tasks").expect(200);

    expect(listResponse.body).toHaveLength(3);

    // 3. Verificar se podemos completar todas as tarefas
    await request(app)
      .patch(`/api/tasks/${task1.body._id}/status`)
      .send({ status: "concluída" })
      .expect(200);

    await request(app)
      .patch(`/api/tasks/${task2.body._id}/status`)
      .send({ status: "concluída" })
      .expect(200);

    await request(app)
      .patch(`/api/tasks/${task3.body._id}/status`)
      .send({ status: "concluída" })
      .expect(200);

    // 4. Verificar se todas as tarefas estão concluídas
    const completedTask1 = await request(app)
      .get(`/api/tasks/${task1.body._id}`)
      .expect(200);

    const completedTask2 = await request(app)
      .get(`/api/tasks/${task2.body._id}`)
      .expect(200);

    const completedTask3 = await request(app)
      .get(`/api/tasks/${task3.body._id}`)
      .expect(200);

    expect(completedTask1.body.status).toBe("concluída");
    expect(completedTask2.body.status).toBe("concluída");
    expect(completedTask3.body.status).toBe("concluída");

    // 5. Limpar todas as tarefas criadas
    await request(app).delete(`/api/tasks/${task1.body._id}`).expect(200);

    await request(app).delete(`/api/tasks/${task2.body._id}`).expect(200);

    await request(app).delete(`/api/tasks/${task3.body._id}`).expect(200);

    // 6. Verificar se todas as tarefas foram removidas
    const finalResponse = await request(app).get("/api/tasks").expect(200);

    expect(finalResponse.body).toHaveLength(0);
  });
});
