const { Task } = require("../models");

class TaskService {
  /**
   * Cria uma nova tarefa
   * @param {Object} taskData - Dados da tarefa
   * @returns {Promise<Object>} - Tarefa criada
   */
  async createTask(taskData) {
    try {
      return await Task.create(taskData);
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        throw new Error(error.errors[0].message);
      }
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
      return await Task.findAll({
        where: filter,
        order: [["created_at", "DESC"]],
      });
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
      const task = await Task.findByPk(id);
      if (!task) {
        throw new Error("Tarefa não encontrada");
      }
      return task;
    } catch (error) {
      if (error.message === "Tarefa não encontrada") {
        throw error;
      }
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
      const task = await this.getTaskById(id);

      await task.update(updateData);

      return task;
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        throw new Error(error.errors[0].message);
      }
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
      const task = await this.getTaskById(id);

      await task.destroy();

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
