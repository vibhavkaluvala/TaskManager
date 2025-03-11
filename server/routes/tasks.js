const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

// Get all tasks
router.get("/", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Add a new task
router.post("/", async (req, res) => {
  const { content, status } = req.body;
  const newTask = new Task({ content, status });
  await newTask.save();
  res.json(newTask);
});

// Update a task
router.put("/:id", async (req, res) => {
  const { content, status } = req.body;
  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    { content, status },
    { new: true }
  );
  res.json(updatedTask);
});

// Delete a task
router.delete("/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;