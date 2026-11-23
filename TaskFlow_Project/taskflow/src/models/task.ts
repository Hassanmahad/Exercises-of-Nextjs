
import mongoose, { Schema, models, model } from "mongoose";

const TaskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: 100,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["todo", "in-progress", "completed"],
      default: "todo",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    dueDate: {
      type: Date,
      default: null,
    },

    userId: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "tasks",
  }
);

const Task = models.Task || model("Task", TaskSchema);

export default Task;
