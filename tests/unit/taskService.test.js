const { sequelize, Task } = require("../../src/models");
const taskService = require("../../src/services/taskService");

// Dados de exemplo para os testes
const sampleTask = {
  title: "Tarefa de teste",
  description: "Descrição da tarefa de teste",
  status: "pendente",
  priority: "média",
};

// Configuração do ambiente de teste
beforeAll(async () => {
  await sequelize.sync({ force: true }); // Recria as tabelas em cada execução
});

// Limpeza do ambiente após os testes
afterAll(async () => {
  await sequelize.close();
});

// Limpeza do banco de dados antes de cada teste
beforeEach(async () => {
  await Task.destroy({ where: {}, truncate: true });
});

describe("TaskService", () => {
  describe("createTask", () => {
    it("deve criar uma nova tarefa com sucesso", async () => {
      const createdTask = await taskService.createTask(sampleTask);

      expect(createdTask).toBeDefined();
      expect(createdTask.title).toBe(sampleTask.title);
      expect(createdTask.description).toBe(sampleTask.description);
      expect(createdTask.status).toBe(sampleTask.status);
      expect(createdTask.priority).toBe(sampleTask.priority);
      expect(createdTask.id).toBeDefined();
    });

    it("deve lançar erro quando dados obrigatórios não são fornecidos", async () => {
      const invalidTask = { description: "Sem título" };

      await expect(taskService.createTask(invalidTask)).rejects.toThrow(
        "O título da tarefa é obrigatório"
      );
    });
  });

  describe("getAllTasks", () => {
    it("deve retornar uma lista vazia quando não há tarefas", async () => {
      const tasks = await taskService.getAllTasks();
      expect(tasks).toEqual([]);
    });

    it("deve retornar todas as tarefas cadastradas", async () => {
      // Criar algumas tarefas de teste
      await Task.bulkCreate([
        sampleTask,
        { ...sampleTask, title: "Segunda tarefa", priority: "alta" },
        { ...sampleTask, title: "Terceira tarefa", status: "concluída" },
      ]);

      const tasks = await taskService.getAllTasks();

      expect(tasks).toHaveLength(3);
      expect(tasks[0].title).toBeDefined();
    });

    it("deve filtrar tarefas corretamente", async () => {
      // Criar algumas tarefas de teste
      await Task.bulkCreate([
        sampleTask,
        { ...sampleTask, title: "Tarefa alta prioridade", priority: "alta" },
        { ...sampleTask, title: "Tarefa concluída", status: "concluída" },
      ]);

      const pendingTasks = await taskService.getAllTasks({
        status: "pendente",
      });
      expect(pendingTasks).toHaveLength(2);

      const highPriorityTasks = await taskService.getAllTasks({
        priority: "alta",
      });
      expect(highPriorityTasks).toHaveLength(1);
      expect(highPriorityTasks[0].priority).toBe("alta");
    });
  });

  describe("getTaskById", () => {
    it("deve retornar uma tarefa específica pelo ID", async () => {
      const createdTask = await Task.create(sampleTask);

      const foundTask = await taskService.getTaskById(createdTask.id);

      expect(foundTask).toBeDefined();
      expect(foundTask.id).toBe(createdTask.id);
      expect(foundTask.title).toBe(sampleTask.title);
    });

    it("deve lançar erro quando a tarefa não existe", async () => {
      const nonExistentId = 9999;

      await expect(taskService.getTaskById(nonExistentId)).rejects.toThrow(
        "Tarefa não encontrada"
      );
    });
  });

  describe("updateTask", () => {
    it("deve atualizar uma tarefa existente", async () => {
      const createdTask = await Task.create(sampleTask);

      const updateData = {
        title: "Título atualizado",
        description: "Descrição atualizada",
      };

      const updatedTask = await taskService.updateTask(
        createdTask.id,
        updateData
      );

      expect(updatedTask.title).toBe(updateData.title);
      expect(updatedTask.description).toBe(updateData.description);
      expect(updatedTask.status).toBe(createdTask.status); // Não mudou
    });

    it("deve lançar erro ao tentar atualizar uma tarefa inexistente", async () => {
      const nonExistentId = 9999;

      await expect(
        taskService.updateTask(nonExistentId, { title: "Novo título" })
      ).rejects.toThrow("Tarefa não encontrada");
    });
  });

  describe("deleteTask", () => {
    it("deve excluir uma tarefa existente", async () => {
      const createdTask = await Task.create(sampleTask);

      const result = await taskService.deleteTask(createdTask.id);

      expect(result.message).toBe("Tarefa removida com sucesso");

      // Verificar se a tarefa foi realmente removida
      const tasks = await Task.findAll();
      expect(tasks).toHaveLength(0);
    });

    it("deve lançar erro ao tentar excluir uma tarefa inexistente", async () => {
      const nonExistentId = 9999;

      await expect(taskService.deleteTask(nonExistentId)).rejects.toThrow(
        "Tarefa não encontrada"
      );
    });
  });

  describe("updateTaskStatus", () => {
    it("deve atualizar apenas o status de uma tarefa", async () => {
      const createdTask = await Task.create(sampleTask);

      const updatedTask = await taskService.updateTaskStatus(
        createdTask.id,
        "concluída"
      );

      expect(updatedTask.status).toBe("concluída");
      expect(updatedTask.title).toBe(sampleTask.title); // Outros campos não mudaram
    });

    it("deve rejeitar um status inválido", async () => {
      const createdTask = await Task.create(sampleTask);

      await expect(
        taskService.updateTaskStatus(createdTask.id, "status_invalido")
      ).rejects.toThrow("Status inválido");
    });
  });
});
