import cors from "cors";
import express from "express";
import { prisma } from "./lib/prisma";

const App = express();

App.use(cors());
App.use(express.json());

App.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Todo List API",
  });
});
App.get("/api/health", (req, res) => {
  res.json({ status: "server is healthy" });
});

// Get all todos
App.get("/api/todos", async (req, res) => {
  const todos = await prisma.todo.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  res.json(todos);
});

// Create a todo
App.post("/api/todos", async (req, res) => {
  const { title } = req.body;

  try {
    if (!title || typeof title !== "string") {
      return res.status(400).json({
        message: "Title is required",
      });
    }

    const todo = await prisma.todo.create({
      data: {
        title,
      },
    });

    res.status(201).json(todo);
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

App.patch("/api/todos/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { completed } = req.body;

  if (Number.isNaN(id)) {
    return res.status(400).json({
      message: "Invalid todo ID",
    });
  }

  if (typeof completed !== "boolean") {
    return res.status(400).json({
      message: "completed must be a boolean",
    });
  }

  const todo = await prisma.todo.update({
    where: {
      id,
    },
    data: {
      completed,
    },
  });

  res.json(todo);
});

App.delete("/api/todos/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({
      message: "Invalid todo ID",
    });
  }

  await prisma.todo.delete({
    where: {
      id,
    },
  });

  res.status(204).send();
});

export default App;
