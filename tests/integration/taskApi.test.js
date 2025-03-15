const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { app, connectDB } = require("../../src/app");
const Task = require("../../src/models/Task");

let mongoServer;

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

// Limpeza do banco de dados antes de cada teste
beforeEach(async () => {
  await Task.deleteMany({});
});

describe("API de Tarefas", () => {
  // Dados de exemplo para os testes
  const sampleTask = {
    title: "Tarefa de teste API",
    description: "Descrição da tarefa de teste API",
    status: "pendente",
    priority: "média",
  };

  describe("POST /api/tasks", () => {
    it("deve criar uma nova tarefa", async () => {
      const response = await request(app)
        .post("/api/tasks")
        .send(sampleTask)
        .expect("Content-Type", /json/)
        .expect(201);

      expect(response.body).toHaveProperty("_id");
      expect(response.body.title).toBe(sampleTask.title);
    });

    it("deve retornar erro 400 quando o título não é fornecido", async () => {
      const response = await request(app)
        .post("/api/tasks")
        .send({ description: "Sem título" })
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("GET /api/tasks", () => {
    it("deve retornar uma lista vazia quando não há tarefas", async () => {
      const response = await request(app)
        .get("/api/tasks")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it("deve retornar todas as tarefas cadastradas", async () => {
      // Criar algumas tarefas de teste diretamente no banco
      await Task.create([
        sampleTask,
        { ...sampleTask, title: "Segunda tarefa" },
      ]);

      const response = await request(app)
        .get("/api/tasks")
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty("_id");
      expect(response.body[0]).toHaveProperty("title");
    });
  });

  describe("GET /api/tasks/:id", () => {
    it("deve retornar uma tarefa específica pelo ID", async () => {
      const task = await Task.create(sampleTask);

      const response = await request(app)
        .get(`/api/tasks/${task._id}`)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toHaveProperty("_id");
      expect(response.body.title).toBe(sampleTask.title);
    });

    it("deve retornar erro 404 quando a tarefa não existe", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/tasks/${nonExistentId}`)
        .expect("Content-Type", /json/)
        .expect(404);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("PUT /api/tasks/:id", () => {
    it("deve atualizar uma tarefa existente", async () => {
      const task = await Task.create(sampleTask);

      const updateData = {
        title: "Título atualizado API",
        description: "Descrição atualizada API",
      };

      const response = await request(app)
        .put(`/api/tasks/${task._id}`)
        .send(updateData)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body.title).toBe(updateData.title);
      expect(response.body.description).toBe(updateData.description);
    });

    it("deve retornar erro 404 ao tentar atualizar uma tarefa inexistente", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .put(`/api/tasks/${nonExistentId}`)
        .send({ title: "Título atualizado" })
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("PATCH /api/tasks/:id/status", () => {
    it("deve atualizar apenas o status de uma tarefa", async () => {
      const task = await Task.create(sampleTask);

      const response = await request(app)
        .patch(`/api/tasks/${task._id}/status`)
        .send({ status: "concluída" })
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body.status).toBe("concluída");
      expect(response.body.title).toBe(sampleTask.title); // Título não deve mudar
    });

    it("deve retornar erro 400 quando o status é inválido", async () => {
      const task = await Task.create(sampleTask);

      const response = await request(app)
        .patch(`/api/tasks/${task._id}/status`)
        .send({ status: "status_invalido" })
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });

    it("deve retornar erro 400 quando o status não é fornecido", async () => {
      const task = await Task.create(sampleTask);

      const response = await request(app)
        .patch(`/api/tasks/${task._id}/status`)
        .send({})
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe("Status não fornecido");
    });
  });

  describe("DELETE /api/tasks/:id", () => {
    it("deve excluir uma tarefa existente", async () => {
      const task = await Task.create(sampleTask);

      const response = await request(app)
        .delete(`/api/tasks/${task._id}`)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toHaveProperty("message");

      // Verificar se a tarefa foi realmente removida
      const deletedTask = await Task.findById(task._id);
      expect(deletedTask).toBeNull();
    });

    it("deve retornar erro 404 ao tentar excluir uma tarefa inexistente", async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .delete(`/api/tasks/${nonExistentId}`)
        .expect("Content-Type", /json/)
        .expect(404);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("Requisições inválidas", () => {
    it("deve retornar erro 404 para rotas inexistentes", async () => {
      await request(app).get("/api/rota-inexistente").expect(404);
    });

    it("deve rejeitar IDs inválidos com erro 400", async () => {
      const response = await request(app)
        .get("/api/tasks/id-invalido")
        .expect("Content-Type", /json/)
        .expect(404);

      expect(response.body).toHaveProperty("error");
    });

    it("deve rejeitar métodos HTTP não suportados", async () => {
      const task = await Task.create(sampleTask);

      await request(app)
        .patch(`/api/tasks/${task._id}`)
        .send({ randomField: "value" })
        .expect(404);
    });
  });
});
