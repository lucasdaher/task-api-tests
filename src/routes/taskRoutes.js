const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

// Rota para criar uma nova tarefa
router.post("/", taskController.createTask);

// Rota para listar todas as tarefas
router.get("/", taskController.getAllTasks);

// Rota para obter uma tarefa específica
router.get("/:id", taskController.getTaskById);

// Rota para atualizar uma tarefa
router.put("/:id", taskController.updateTask);

// Rota para atualizar apenas o status de uma tarefa
router.patch("/:id/status", taskController.updateTaskStatus);

// Rota para excluir uma tarefa
router.delete("/:id", taskController.deleteTask);

module.exports = router;
