import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ConteudoTrilha = sequelize.define('ConteudoTrilha', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_trilha: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  titulo_aba: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  conteudo_html: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  ordem: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'conteudos_trilha',
  timestamps: true,
});

export default ConteudoTrilha;
