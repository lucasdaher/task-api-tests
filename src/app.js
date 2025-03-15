const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const taskRoutes = require("./routes/taskRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/todo_app"
    );
    console.log("MongoDB conectado com sucesso");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error.message);
    process.exit(1);
  }
};

app.use("/api/tasks", taskRoutes);

// Teste básico para validar funcionamento da rota GET
app.get("/", (req, res) => {
  res.json({ message: "API de Tarefas funcionando!" });
});

if (process.env.NODE_ENV !== "test") {
  connectDB();
  app.listen(PORT, () => {
    console.log(`O servidor está rodando na porta ${PORT}`);
  });
}

module.exports = { app, connectDB };
