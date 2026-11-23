
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  type DragEndEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

type Task = {
  _id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
};

const columns = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "completed", title: "Completed" },
] as const;

function TaskCard({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: task._id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`cursor-grab rounded-lg border border-gray-200 bg-white p-4 shadow-sm active:cursor-grabbing ${
        isDragging ? "opacity-40" : ""
      }`}
    >
      <h3 className="font-semibold text-gray-900">
        {task.title}
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        {task.description || "No description"}
      </p>

      <span className="mt-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
        {task.priority} priority
      </span>
    </div>
  );
}

function KanbanColumn({
  id,
  title,
  tasks,
}: {
  id: string;
  title: string;
  tasks: Task[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-80 rounded-xl p-4 ${
        isOver ? "bg-blue-100" : "bg-gray-100"
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-bold text-gray-800">{title}</h2>
        <span className="rounded-full bg-white px-3 py-1 text-sm text-gray-600">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}

        {tasks.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-400">
            Drop tasks here
          </p>
        )}
      </div>
    </div>
  );
}

export default function KanbanBoard({
  tasks,
}: {
  tasks: Task[];
}) {
  const router = useRouter();
  const [error, setError] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const taskId = String(active.id);
    const newStatus = String(over.id);

    const task = tasks.find((item) => item._id === taskId);

    if (!task || task.status === newStatus) return;

    if (!columns.some((column) => column.id === newStatus)) {
      return;
    }

    setError("");

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to move task");
        return;
      }

      router.refresh();
    } catch {
      setError("Something went wrong while moving the task.");
    }
  }

  return (
    <section className="mt-8">
      <h2 className="mb-5 text-2xl font-bold text-gray-900">
        Kanban Board
      </h2>

      {error && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
      >
        <div className="grid gap-5 md:grid-cols-3">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={tasks.filter(
                (task) => task.status === column.id
              )}
            />
          ))}
        </div>
      </DndContext>
    </section>
  );
}
