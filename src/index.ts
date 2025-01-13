import express, { type Request, type Response } from 'express';
import { env } from './config';
import { getTotalCommitsByAuthor } from './github-service';

const app = express();

app.use(express.json());
const { port } = env;

app.get('/', async (req: Request, res: Response) => {
  const { username } = req.query;

  if (!username) {
    res.status(400).json({ error: 'O parâmetro "username" é obrigatório' });
    return;
  }

  try {
    const { totalCommits, totalRepositories } = await getTotalCommitsByAuthor(username as string);
    res.send({ totalCommits, totalRepositories });
    return;
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
