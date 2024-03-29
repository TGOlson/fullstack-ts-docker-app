import express from 'express';
import morgan from 'morgan';
import nocache from 'nocache';

import { PrismaClient, TodoItem } from '@prisma/client';
import { CreateTodoItem } from '../shared/types';

const prisma = new PrismaClient();

const app = express();

app.use(nocache());
app.use(morgan('tiny'));

const PORT = 3000;

app.get('/todos', async (_req, res) => {
  const allTodos = await prisma.todoItem.findMany({
    orderBy: { createdAt: 'asc' },
  });
  res.json(allTodos);
});

app.post('/todos', express.json(), async (req, res) => {
  const partialTodo = req.body as CreateTodoItem;

  const newTodo = await prisma.todoItem.create({
    data: partialTodo,
  });

  res.json(newTodo);
});

app.post('/todos/:id', express.json(), async (req, res) => {
  const id = parseInt(req.params.id);
  const update = req.body as Partial<TodoItem>;


  const updatedTodo = await prisma.todoItem.update({
    where: { id },
    data: update,
  });

  res.json(updatedTodo);
});

export const startServer = () => app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
