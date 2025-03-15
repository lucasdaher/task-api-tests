const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "O título da tarefa é obrigatório"],
    trim: true,
    maxlength: [100, "O título não pode ter mais de 100 caracteres"],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "A descrição não pode ter mais de 500 caracteres"],
  },
  status: {
    type: String,
    enum: ["pendente", "em andamento", "concluída"],
    default: "pendente",
  },
  priority: {
    type: String,
    enum: ["baixa", "média", "alta"],
    default: "média",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
  },
});

module.exports = mongoose.model("Task", TaskSchema);
