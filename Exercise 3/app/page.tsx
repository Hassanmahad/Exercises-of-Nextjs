
"use client";

import { useActionState } from "react";
import { greet } from "./action";

const initialState = {
  success: false,
  message: "",
  error: "",
};

export default function FormPage() {
  const [state, formAction] = useActionState(greet, initialState);

  return (
    <form
      action={formAction}
      className="space-y-4 p-6 max-w-md mx-auto"
    >
      <input
        name="name"
        placeholder="Enter your name"
        className="border p-2 w-full"
        required
      />

      <input
        name="email"
        type="email"
        placeholder="Enter your Email"
        className="border p-2 w-full"
        required
      />

      <input
        name="password"
        type="password"
        placeholder="Enter Your Password"
        className="border p-2 w-full"
        required
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Submit
      </button>

      {state.success && (
        <p className="text-green-600 mt-4 font-medium">
          {state.message}
        </p>
      )}

      {!state.success && state.error && (
        <p className="text-red-600 mt-4 font-medium">
          {state.error}
        </p>
      )}
    </form>
  );
}
