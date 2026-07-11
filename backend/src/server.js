import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import sequelize from './config/database.js';
import routes from './routes/index.js';
import './models/index.js';

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/', routes);

const PORT = process.env.PORT || 3000;

async function iniciar() {
  try {
    await sequelize.sync({ alter: true });
    console.log('Banco sincronizado');

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (e) {
    console.log('Erro ao iniciar:', e);
  }
}

iniciar();
