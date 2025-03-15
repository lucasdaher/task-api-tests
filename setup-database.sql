CREATE DATABASE IF NOT EXISTS task_api_tests
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Usar o banco de dados criado
USE task_api_tests;

-- Criação da tabela de tarefas
-- Não é necessário criar manualmente, o Sequelize criará automaticamente,
-- mas este script serve como referência da estrutura

CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  status ENUM('pendente', 'em andamento', 'concluída') NOT NULL DEFAULT 'pendente',
  priority ENUM('baixa', 'média', 'alta') NOT NULL DEFAULT 'média',
  due_date DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Criação de um usuário para a aplicação (opcional)
-- CUIDADO: Altere a senha para uma senha segura!
-- CREATE USER 'todo_user'@'localhost' IDENTIFIED BY 'sua_senha_segura';
-- GRANT ALL PRIVILEGES ON todo_app.* TO 'todo_user'@'localhost';
-- FLUSH PRIVILEGES;

-- Inserir algumas tarefas de exemplo (opcional)
INSERT INTO tasks (title, description, status, priority) VALUES 
('Fazer compras', 'Comprar leite, pão e ovos', 'pendente', 'média'),
('Estudar para a prova', 'Revisar capítulos 3 e 4', 'em andamento', 'alta'),
('Pagar contas', 'Água, luz e internet', 'concluída', 'alta');