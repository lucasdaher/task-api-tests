const request = require("supertest");
const { sequelize, Task } = require("../../src/models");
const { app } = require("../../src/app");

beforeAll(async () => {
  await sequelize.sync({ force: true }); // aqui ele recria as tabelas antes dos testes
});

afterAll(async () => {
  await sequelize.close(); // limpa o ambiente depois dos testes
});

// Limpeza do banco de dados antes de todos os testes e2e executadoss
beforeEach(async () => {
  await Task.destroy({ where: {}, truncate: true });
});

describe("E2E - Fluxo completo de gerenciamento de tarefas", () => {
  // obj com dados de teste para criar uma nova task
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

  it("deve permitir criar, listar, atualizar e excluir tarefas", async () => {
    const initialResponse = await request(app)
      .get("/api/tasks")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(initialResponse.body).toEqual([]);

    const createResponse = await request(app)
      .post("/api/tasks")
      .send(newTask)
      .expect("Content-Type", /json/)
      .expect(201);

    expect(createResponse.body).toHaveProperty("id");
    expect(createResponse.body.title).toBe(newTask.title);
    expect(createResponse.body.status).toBe("pendente");

    const createdTaskId = createResponse.body.id;

    const getResponse = await request(app)
      .get(`/api/tasks/${createdTaskId}`)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(getResponse.body.id).toBe(createdTaskId);
    expect(getResponse.body.title).toBe(newTask.title);

    const updateStatusResponse = await request(app)
      .patch(`/api/tasks/${createdTaskId}/status`)
      .send({ status: "em andamento" })
      .expect("Content-Type", /json/)
      .expect(200);

    // Forcei o erro
    // expect(updateStatusResponse.body.status).toBe("em andamento");
    expect(updateStatusResponse.body.status).toBe("pendente");
    expect(updateStatusResponse.body.id).toBe(createdTaskId);

    const updateResponse = await request(app)
      .put(`/api/tasks/${createdTaskId}`)
      .send(updatedTask)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(updateResponse.body.title).toBe(updatedTask.title);
    expect(updateResponse.body.description).toBe(updatedTask.description);
    expect(updateResponse.body.priority).toBe(updatedTask.priority);
    expect(updateResponse.body.status).toBe("em andamento"); // Status não deve ter sido alterado pq forcei um erro passando outro parâmetro

    const completeResponse = await request(app)
      .patch(`/api/tasks/${createdTaskId}/status`)
      .send({ status: "concluída" })
      .expect("Content-Type", /json/)
      .expect(200);

    expect(completeResponse.body.status).toBe("concluída");

    const deleteResponse = await request(app)
      .delete(`/api/tasks/${createdTaskId}`)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(deleteResponse.body).toHaveProperty("message");
    expect(deleteResponse.body.message).toBe("Tarefa removida com sucesso");

    const verifyDeleteResponse = await request(app)
      .get(`/api/tasks/${createdTaskId}`)
      .expect("Content-Type", /json/)
      .expect(404);

    expect(verifyDeleteResponse.body).toHaveProperty("error");
  });

  it("deve retornar erros apropriados para requisições inválidas", async () => {
    const invalidTaskResponse = await request(app)
      .post("/api/tasks")
      .send({ description: "Tarefa sem título" })
      .expect("Content-Type", /json/)
      .expect(400);

    expect(invalidTaskResponse.body).toHaveProperty("error");

    const nonExistentId = 9999;
    const nonExistentResponse = await request(app)
      .get(`/api/tasks/${nonExistentId}`)
      .expect("Content-Type", /json/)
      .expect(404);

    expect(nonExistentResponse.body).toHaveProperty("error");

    const tempTask = await request(app)
      .post("/api/tasks")
      .send(newTask)
      .expect(201);

    const tempTaskId = tempTask.body.id;

    const invalidStatusResponse = await request(app)
      .patch(`/api/tasks/${tempTaskId}/status`)
      .send({ status: "status_invalido" })
      .expect("Content-Type", /json/)
      .expect(400);

    expect(invalidStatusResponse.body).toHaveProperty("error");

    await request(app).delete(`/api/tasks/${tempTaskId}`).expect(200);
  });

  it("deve lidar corretamente com múltiplas tarefas", async () => {
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

    const listResponse = await request(app).get("/api/tasks").expect(200);

    expect(listResponse.body).toHaveLength(3);

    await request(app)
      .patch(`/api/tasks/${task1.body.id}/status`)
      .send({ status: "concluída" })
      .expect(200);

    await request(app)
      .patch(`/api/tasks/${task2.body.id}/status`)
      .send({ status: "concluída" })
      .expect(200);

    await request(app)
      .patch(`/api/tasks/${task3.body.id}/status`)
      .send({ status: "concluída" })
      .expect(200);

    const completedTask1 = await request(app)
      .get(`/api/tasks/${task1.body.id}`)
      .expect(200);

    const completedTask2 = await request(app)
      .get(`/api/tasks/${task2.body.id}`)
      .expect(200);

    const completedTask3 = await request(app)
      .get(`/api/tasks/${task3.body.id}`)
      .expect(200);

    expect(completedTask1.body.status).toBe("concluída");
    expect(completedTask2.body.status).toBe("concluída");
    expect(completedTask3.body.status).toBe("concluída");

    await request(app).delete(`/api/tasks/${task1.body.id}`).expect(200);

    await request(app).delete(`/api/tasks/${task2.body.id}`).expect(200);

    await request(app).delete(`/api/tasks/${task3.body.id}`).expect(200);

    const finalResponse = await request(app).get("/api/tasks").expect(200);

    expect(finalResponse.body).toHaveLength(0);
  });
});
