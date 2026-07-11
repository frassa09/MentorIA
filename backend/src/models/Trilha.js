import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Trilha = sequelize.define('Trilha', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  area: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nvl: {
    type: DataTypes.ENUM('iniciante', 'intermediario', 'avancado'),
    allowNull: false,
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  resumo: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'trilhas',
  timestamps: true,
});

export default Trilha;
