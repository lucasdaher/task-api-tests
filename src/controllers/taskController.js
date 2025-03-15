const taskService = require("../services/taskService");

/**
 * Controlador para as operações relacionadas a tarefas
 */
const taskController = {
  /**
   * Criar uma nova tarefa
   */
  createTask: async (req, res) => {
    try {
      const task = await taskService.createTask(req.body);
      return res.status(201).json(task);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  /**
   * Listar todas as tarefas
   */
  getAllTasks: async (req, res) => {
    try {
      const tasks = await taskService.getAllTasks();
      return res.status(200).json(tasks);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  /**
   * Obter uma tarefa específica por ID
   */
  getTaskById: async (req, res) => {
    try {
      const task = await taskService.getTaskById(req.params.id);
      return res.status(200).json(task);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  },

  /**
   * Atualizar uma tarefa existente
   */
  updateTask: async (req, res) => {
    try {
      const task = await taskService.updateTask(req.params.id, req.body);
      return res.status(200).json(task);
    } catch (error) {
      if (error.message.includes("não encontrada")) {
        return res.status(404).json({ error: error.message });
      }
      return res.status(400).json({ error: error.message });
    }
  },

  /**
   * Atualizar o status de uma tarefa
   */
  updateTaskStatus: async (req, res) => {
    try {
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ error: "Status não fornecido" });
      }

      const task = await taskService.updateTaskStatus(req.params.id, status);
      return res.status(200).json(task);
    } catch (error) {
      if (error.message.includes("não encontrada")) {
        return res.status(404).json({ error: error.message });
      }
      return res.status(400).json({ error: error.message });
    }
  },

  /**
   * Excluir uma tarefa
   */
  deleteTask: async (req, res) => {
    try {
      const result = await taskService.deleteTask(req.params.id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  },
};

module.exports = taskController;
