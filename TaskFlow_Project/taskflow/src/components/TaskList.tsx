
"use client";

import { useState } from "react";
import TaskActions from "@/components/TaskActions";

type Task = {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string | null;
};

export default function TaskList({ tasks }: { tasks: Task[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;

    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <section className="mt-8 rounded-xl bg-white p-6 shadow">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          My Tasks
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Search and manage your tasks.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 grid gap-3 md:grid-cols-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
          className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-3"
        >
          <option value="all">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-3"
        >
          <option value="all">All Priorities</option>
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
      </div>

      <p className="mb-4 text-sm text-gray-500">
        Showing {filteredTasks.length} of {tasks.length} tasks
      </p>

      {/* Task Results */}
      {filteredTasks.length === 0 ? (
        <p className="rounded-lg bg-gray-50 p-6 text-center text-gray-500">
          No tasks found.
        </p>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className="rounded-lg border border-gray-200 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {task.title}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    {task.description || "No description"}
                  </p>
                </div>

                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
                  {task.status}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                <span>Priority: {task.priority}</span>

                <span>
                  Due date:{" "}
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "Not set"}
                </span>
              </div>

              <TaskActions
                taskId={task._id}
                title={task.title}
                description={task.description}
                currentStatus={task.status}
                currentPriority={task.priority}
                dueDate={task.dueDate}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
