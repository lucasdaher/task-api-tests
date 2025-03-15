// Define o ambiente como teste
process.env.NODE_ENV = "test";

// Aumenta o timeout para operações com banco de dados
jest.setTimeout(10000);
