"use strict";

module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define(
    "Task",
    {
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "O título da tarefa é obrigatório",
          },
          len: {
            args: [1, 100],
            msg: "O título não pode ter mais de 100 caracteres",
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          len: {
            args: [0, 500],
            msg: "A descrição não pode ter mais de 500 caracteres",
          },
        },
      },
      status: {
        type: DataTypes.ENUM("pendente", "em andamento", "concluída"),
        defaultValue: "pendente",
        allowNull: false,
        validate: {
          isIn: {
            args: [["pendente", "em andamento", "concluída"]],
            msg: "Status deve ser pendente, em andamento ou concluída",
          },
        },
      },
      priority: {
        type: DataTypes.ENUM("baixa", "média", "alta"),
        defaultValue: "média",
        allowNull: false,
        validate: {
          isIn: {
            args: [["baixa", "média", "alta"]],
            msg: "Prioridade deve ser baixa, média ou alta",
          },
        },
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      tableName: "tasks",
      underscored: true, // usa snake_case para nomes de colunas no banco
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return Task;
};
