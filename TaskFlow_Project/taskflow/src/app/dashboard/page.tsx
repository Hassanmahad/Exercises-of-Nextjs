import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import KanbanBoard from "@/components/KanbanBoard";
import TaskList from "@/components/TaskList";

import { connectToDatabase } from "@/lib/mongodb";
import Task from "@/models/Task";

import LogoutButton from "@/components/LogoutButton";
import CreateTaskForm from "@/components/CreateTaskForm";
import TaskActions from "@/components/TaskActions";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  // Connect to MongoDB
  await connectToDatabase();

  // Fetch only the logged-in user's tasks
  const tasks = await Task.find({
    userId: session.user.id,
  }).sort({ createdAt: -1 });

  // Calculate task statistics
  const totalTasks = tasks.length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "in-progress",
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "completed",
  ).length;

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-600">TaskFlow</h1>

            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              Welcome, {session.user.name}!
            </h2>

            <p className="mt-2 text-gray-500">
              Here is your personal task dashboard.
            </p>
          </div>

          <LogoutButton />
        </header>

        {/* Statistics */}
        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="font-semibold text-gray-600">Total Tasks</h3>
            <p className="mt-3 text-3xl font-bold text-blue-600">
              {totalTasks}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="font-semibold text-gray-600">In Progress</h3>
            <p className="mt-3 text-3xl font-bold text-yellow-500">
              {inProgressTasks}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h3 className="font-semibold text-gray-600">Completed</h3>
            <p className="mt-3 text-3xl font-bold text-green-600">
              {completedTasks}
            </p>
          </div>
        </section>

        {/* Create Task Form */}
        <section className="mt-8">
          <CreateTaskForm />
        </section>
        <KanbanBoard
          tasks={tasks.map((task) => ({
            _id: task._id.toString(),
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
          }))}
        />
        {/* Task List */}
        <TaskList
          tasks={tasks.map((task) => ({
            _id: task._id.toString(),
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,
          }))}
        />
      </div>
    </main>
  );
}
