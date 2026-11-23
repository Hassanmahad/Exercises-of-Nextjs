
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type TaskActionsProps = {
  taskId: string;
  title: string;
  description: string;
  currentStatus: string;
  currentPriority: string;
  dueDate: string | null;
};

export default function TaskActions({
  taskId,
  title,
  description,
  currentStatus,
  currentPriority,
  dueDate,
}: TaskActionsProps) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description);
  const [status, setStatus] = useState(currentStatus);
  const [priority, setPriority] = useState(currentPriority);
  const [editDueDate, setEditDueDate] = useState(
    dueDate ? new Date(dueDate).toISOString().slice(0, 10) : ""
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpdate() {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          status,
          priority,
          dueDate: editDueDate || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
          data.errors?.title?.[0] ||
          "Failed to update task"
        );
        return;
      }

      setIsEditing(false);
      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to delete task");
        return;
      }

      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mt-5 border-t border-gray-200 pt-4">
      {isEditing && (
        <div className="mb-4 space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            maxLength={100}
            placeholder="Task title"
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />

          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            maxLength={1000}
            placeholder="Task description"
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />

          <input
            type="date"
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          disabled={isLoading}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          disabled={isLoading}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>

        {isEditing ? (
          <>
            <button
              onClick={handleUpdate}
              disabled={isLoading || !editTitle.trim()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>

            <button
              onClick={() => {
                setIsEditing(false);
                setEditTitle(title);
                setEditDescription(description);
              }}
              disabled={isLoading}
              className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            disabled={isLoading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Edit
          </button>
        )}

        <button
          onClick={handleDelete}
          disabled={isLoading}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
        >
          Delete
        </button>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
