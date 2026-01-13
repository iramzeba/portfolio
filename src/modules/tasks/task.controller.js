const Task = require("./task.model");

// ADMIN only
exports.createTask = async (req, res) => {
  if (req.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  const task = await Task.create({
    title: req.body.title,
    description: req.body.description,
    projectId: req.body.projectId,
    orgId: req.orgId,
    assignedTo: req.body.assignedTo,
    createdBy: req.user.id
  });

  res.status(201).json(task);
};

// ADMIN + MEMBER
exports.getTasks = async (req, res) => {
  const tasks = await Task.find({
    projectId: req.params.projectId,
    orgId: req.orgId
  },{title:1,description:1,status:1}).lean();

  res.json(tasks);
};

// ADMIN + MEMBER (status update)
exports.updateTaskStatus = async (req, res) => {
  const task = await Task.findOneAndUpdate(
    {
      _id: req.params.id,
      orgId: req.orgId
    },
    { status: req.body.status },
    { new: true }
  );

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json(task);
};

// ADMIN only
exports.deleteTask = async (req, res) => {
  if (req.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  await Task.deleteOne({
    _id: req.params.id,
    orgId: req.orgId
  });

  res.json({ message: "Task deleted" });
};
