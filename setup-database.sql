CREATE DATABASE IF NOT EXISTS task_api_tests
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE task_api_tests;

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

-- CREATE USER 'nomedousuario'@'localhost' IDENTIFIED BY 'bota a asenha aqui rafuxo';
-- GRANT ALL PRIVILEGES ON todo_app.* TO 'nomedousuario'@'localhost';
-- FLUSH PRIVILEGES;

INSERT INTO tasks (title, description, status, priority) VALUES
('Fazer trabalho de teste', 'Desenvolver sistema para testes', 'pendente', 'alta'),
('Estudar para a prova', 'Revisar conteúdo de testes', 'em andamento', 'baixa'),
('Pagar contas', 'Água, luz e internet', 'concluída', 'alta');
