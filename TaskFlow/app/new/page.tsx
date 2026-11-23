
"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createTodoAction, type FormState } from "../actions/create";

const initialState: FormState = {
  error: null,
};

export default function NewTodo() {
  const [state, formAction, isPending] = useActionState(
    createTodoAction,
    initialState
  );

  return (
    <main className="max-w-2xl mx-auto mt-10 p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Add New Todo
          </h1>

          <Link
            href="/"
            className="text-rose-600 hover:text-rose-800 transition-colors"
          >
            ← Back to Todos
          </Link>
        </div>

        <form action={formAction}>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Todo Title
            </label>

            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter your todo..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              maxLength={200}
              autoFocus
            />

            <p className="text-xs text-gray-500 mt-1">
              Maximum 200 characters
            </p>

            {state.error && (
              <p className="text-red-500 text-sm mt-2">
                {state.error}
              </p>
            )}
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-rose-600 text-white py-2 px-4 rounded-md hover:bg-rose-700 disabled:opacity-50 transition-colors"
            >
              {isPending ? "Creating..." : "Create Todo"}
            </button>

            <Link
              href="/"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
