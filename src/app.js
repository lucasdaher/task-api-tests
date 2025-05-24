const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { sequelize } = require("./models");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
app.use("/api/tasks", taskRoutes);

// Rota de teste básico
app.get("/", (req, res) => {
  res.json({ message: "API de Tarefas funcionando!" });
});

// Inicialização do servidor
const syncDatabase = async () => {
  try {
    // Em produção, use { force: false }
    // Durante desenvolvimento, você pode usar { force: true } para recriar as tabelas
    // ou { alter: true } para aplicar alterações
    const syncOptions =
      process.env.NODE_ENV === "production"
        ? { force: false }
        : { alter: true };

    await sequelize.sync(syncOptions);
    console.log("Banco de dados sincronizado com sucesso");
  } catch (error) {
    console.error("Erro ao sincronizar o banco de dados:", error.message);
    process.exit(1);
  }
};

// Inicialização do servidor
if (process.env.NODE_ENV !== "test") {
  syncDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  });
}

module.exports = { app, syncDatabase };
