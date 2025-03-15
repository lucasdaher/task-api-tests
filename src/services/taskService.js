const Task = require("../models/Task");

class TaskService {
  /**
   * Cria uma nova tarefa
   * @param {Object} taskData - Dados da tarefa
   * @returns {Promise<Object>} - Tarefa criada
   */
  async createTask(taskData) {
    try {
      const task = new Task(taskData);
      return await task.save();
    } catch (error) {
      throw new Error(`Erro ao criar tarefa: ${error.message}`);
    }
  }

  /**
   * Lista todas as tarefas
   * @param {Object} filter - Filtros opcionais
   * @returns {Promise<Array>} - Lista de tarefas
   */
  async getAllTasks(filter = {}) {
    try {
      return await Task.find(filter).sort({ createdAt: -1 });
    } catch (error) {
      throw new Error(`Erro ao listar tarefas: ${error.message}`);
    }
  }

  /**
   * Busca uma tarefa pelo ID
   * @param {string} id - ID da tarefa
   * @returns {Promise<Object>} - Tarefa encontrada
   */
  async getTaskById(id) {
    try {
      const task = await Task.findById(id);
      if (!task) {
        throw new Error("Tarefa não encontrada");
      }
      return task;
    } catch (error) {
      throw new Error(`Erro ao buscar tarefa: ${error.message}`);
    }
  }

  /**
   * Atualiza uma tarefa existente
   * @param {string} id - ID da tarefa
   * @param {Object} updateData - Dados para atualização
   * @returns {Promise<Object>} - Tarefa atualizada
   */
  async updateTask(id, updateData) {
    try {
      const task = await Task.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!task) {
        throw new Error("Tarefa não encontrada");
      }

      return task;
    } catch (error) {
      throw new Error(`Erro ao atualizar tarefa: ${error.message}`);
    }
  }

  /**
   * Remove uma tarefa pelo ID
   * @param {string} id - ID da tarefa
   * @returns {Promise<Object>} - Resultado da operação
   */
  async deleteTask(id) {
    try {
      const task = await Task.findByIdAndDelete(id);

      if (!task) {
        throw new Error("Tarefa não encontrada");
      }

      return { message: "Tarefa removida com sucesso" };
    } catch (error) {
      throw new Error(`Erro ao remover tarefa: ${error.message}`);
    }
  }

  /**
   * Atualiza o status de uma tarefa
   * @param {string} id - ID da tarefa
   * @param {string} status - Novo status
   * @returns {Promise<Object>} - Tarefa atualizada
   */
  async updateTaskStatus(id, status) {
    try {
      if (!["pendente", "em andamento", "concluída"].includes(status)) {
        throw new Error("Status inválido");
      }

      return await this.updateTask(id, { status });
    } catch (error) {
      throw new Error(`Erro ao atualizar status: ${error.message}`);
    }
  }
}

module.exports = new TaskService();
