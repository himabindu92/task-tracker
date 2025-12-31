const express = require("express");
const cors = require("cors");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const { format, parse, isValid } = require("date-fns");

const server = express();
server.use(express.json());
server.use(cors());

// Database Path
const databasePath = path.join(__dirname, "databaseTracker.db");

let db = null;

// Initialize DB & Server
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    // Auto Create Table (important for Render)
    await db.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        priority TEXT,
        due_date TEXT,
        status TEXT,
        created_at TEXT
      )
    `);

    server.listen(5000, () => {
      console.log("Server running at http://localhost:5000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// Middleware — Validate Body
const checkRequestBody = (request, response, next) => {
  const { title, description, priority, due_date, status, created_at } =
    request.body;
  const { taskid } = request.params;

  if (priority !== undefined) {
    const priorityValues = ["High", "Medium", "Low"];
    if (!priorityValues.includes(priority)) {
      response.status(400);
      response.send("Invalid Task Priority");
      return;
    }
  }

  if (status !== undefined) {
    const statusValues = ["Open", "In Progress", "Done"];
    if (!statusValues.includes(status)) {
      response.status(400);
      response.send("Invalid Task Status");
      return;
    }
  }

  if (due_date !== undefined) {
    const parsed = parse(due_date, "yyyy-MM-dd", new Date());
    if (!isValid(parsed)) {
      response.status(400);
      response.send("Invalid Due Date");
      return;
    }
    request.due_date = format(parsed, "yyyy-MM-dd");
  }

  if (created_at !== undefined) {
    const parsed = parse(created_at, "yyyy-MM-dd", new Date());
    if (!isValid(parsed)) {
      response.status(400);
      response.send("Invalid Created At Date");
      return;
    }
    request.created_at = format(parsed, "yyyy-MM-dd");
  }

  request.taskid = taskid;
  request.title = title;
  request.description = description;
  next();
};

// CREATE Task
server.post("/tasks/", checkRequestBody, async (req, res) => {
  const { title, description, priority, due_date, status, created_at } =
    req.body;

  const query = `
    INSERT INTO tasks (title, description, priority, due_date, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  await db.run(query, [title, description, priority, due_date, status, created_at]);

  res.send("Task Successfully Added");
});

// UPDATE Task
server.patch("/tasks/:taskid/", checkRequestBody, async (req, res) => {
  const { taskid } = req.params;
  const { title, priority, due_date, status, description } = req.body;

  let updateField = "";
  if (status !== undefined) updateField = `status='${status}'`;
  else if (priority !== undefined) updateField = `priority='${priority}'`;
  else if (title !== undefined) updateField = `title='${title}'`;
  else if (due_date !== undefined) updateField = `due_date='${due_date}'`;
  else if (description !== undefined) updateField = `description='${description}'`;

  await db.run(`UPDATE tasks SET ${updateField} WHERE id=${taskid}`);
  res.send("Task Updated");
});

// GET All Tasks
server.get("/tasks/all", async (req, res) => {
  const tasks = await db.all(`SELECT * FROM tasks`);
  res.send(tasks);
});

// GET Task by ID
server.get("/tasks/:taskid/", async (req, res) => {
  const { taskid } = req.params;
  const task = await db.get(`SELECT * FROM tasks WHERE id=${taskid}`);
  res.send(task);
});

// GET Filter Tasks
server.get("/tasks", async (req, res) => {
  const { status, priority, sort_by } = req.query;
  let q = `SELECT * FROM tasks`;

  if (status && !priority) q += ` WHERE status='${status}'`;
  if (priority && !status) q += ` WHERE priority='${priority}'`;
  if (status && priority)
    q += ` WHERE status='${status}' AND priority='${priority}'`;

  if (sort_by === "due_date") q += ` ORDER BY due_date`;

  const tasks = await db.all(q);
  res.send(tasks);
});

// DELETE Task
server.delete("/tasks/:taskid/", async (req, res) => {
  const { taskid } = req.params;
  await db.run(`DELETE FROM tasks WHERE id=${taskid}`);
  res.send("Task Deleted");
});


