const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  const tasks = await Task.find({ userId: req.user });
  res.json(tasks);
};

exports.createTask = async (req, res) => {
  const { name, description, priority } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Task name is required' });
  }

  try {
    const task = await Task.create({
      name,
      description,
      priority,
      userId: req.user,
    });
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create task' });
  }
};
exports.updateTask = async (req, res) => {
  const updates = {
    completed: req.body.completed,
  };

  if (req.body.description !== undefined) updates.description = req.body.description;
  if (req.body.priority !== undefined) updates.priority = req.body.priority;

  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user },
      updates,
      { new: true }
    );

    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating task' });
  }
};

exports.deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json({ message: 'Task deleted' });
};
