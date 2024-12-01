const express = require('express');
const { resolve } = require('path');
let cors = require('cors');

const app = express();
const port = 3000;
app.use(express.static('static'));
app.use(cors());

let tasks = [
  { taskId: 1, text: 'Fix bug #101', priority: 2 },
  { taskId: 2, text: 'Implement feature #202', priority: 1 },
  { taskId: 3, text: 'Write documentation', priority: 3 },
];

function sortTaskByPriority(task1, task2) {
  return task1.priority - task2.priority;
}
function getUpdatedTasks(taskId, newPriority) {
  for (let i = 0; i < tasks.length; i++) {
    if (taskId == tasks[i].taskId) {
      tasks[i].priority = newPriority;
    }
  }
  return tasks;
}

function getUpdatedTextTask(taskId, newText) {
  for (let i = 0; i < tasks.length; i++) {
    if (taskId == tasks[i].taskId) {
      tasks[i].text = newText;
    }
  }
  return tasks;
}

function shouldDeleteTask(task, taskId) {
  return task.taskId != taskId;
}

function filterTasksByPriority(task, priority) {
  return task.priority == priority;
}
app.get('/tasks/add', (req, res) => {
  let task = {
    taskId: parseInt(req.query.taskId),
    text: req.query.text,
    priority: req.query.priority,
  };
  tasks.push(task);
  res.json({ tasks: tasks });
});

app.get('/tasks', (req, res) => {
  res.json({ tasks: tasks });
});

app.get('/tasks/sort-by-priority', (req, res) => {
  let tempTasks = tasks.slice();
  tempTasks.sort(sortTaskByPriority);
  res.json({ task: tempTasks });
});

app.get('/tasks/edit-priority', (req, res) => {
  let taskId = parseInt(req.query.taskId);
  let newPriority = parseInt(req.query.priority);

  res.json({ tasks: getUpdatedTasks(taskId, newPriority) });
});

app.get('/tasks/edit-text', (req, res) => {
  let taskId = parseInt(req.query.taskId);
  let newText = req.query.text;

  res.json({ tasks: getUpdatedTextTask(taskId, newText) });
});

app.get('/tasks/delete', (req, res) => {
  let taskId = parseInt(req.query.taskId);
  let result = tasks.filter((task) => shouldDeleteTask(task, taskId));
  res.json({ tasks: result });
});

app.get('/tasks/filter-by-priority', (req, res) => {
  let priority = parseInt(req.query.priority);
  let result = tasks.filter((task) => filterTasksByPriority(task, priority));
  res.json({ tasks: result });
});

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
