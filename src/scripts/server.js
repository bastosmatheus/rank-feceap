import pkg from 'pg';
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url';
import path from 'node:path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const { Client } = pkg;

app.use(cors());

app.use(express.static(path.join(__dirname, "..")));

app.get('/projetos-mais-votados', async (request, response) => {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
  });

  await client.connect();

  const data = await client.query(`
    SELECT nome, COUNT(nome) quantidade_votos, area FROM votos
    INNER JOIN projetos ON votos.id_projeto = projetos.id
    GROUP BY nome, area
    ORDER BY quantidade_votos DESC
    LIMIT 6;
  `);

  const mostVotedProjects = data.rows;

  await client.end();

  return response.status(200).json({ projects: mostVotedProjects })
})

app.listen(process.env.PORT, () => console.log(`API rodando na porta ${process.env.PORT}`))

