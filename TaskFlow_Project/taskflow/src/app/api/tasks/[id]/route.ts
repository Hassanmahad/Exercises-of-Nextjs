import { updateTaskSchema } from "@/lib/validations/task";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import mongoose from "mongoose";

import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Task from "@/models/Task";

// PATCH: Update a task
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid task ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate update data
    const validation = updateTaskSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const updates = { ...validation.data };

    if (updates.title !== undefined) {
      updates.title = updates.title.trim();
    }

    if (updates.dueDate !== undefined) {
      updates.dueDate = updates.dueDate
        ? new Date(updates.dueDate)
        : null;
    }

    await connectToDatabase();

    const task = await Task.findOneAndUpdate(
      {
        _id: id,
        userId: session.user.id,
      },
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return NextResponse.json(
        { message: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error("PATCH task error:", error);

    return NextResponse.json(
      { message: "Failed to update task" },
      { status: 500 }
    );
  }
}


// DELETE: Delete a task
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid task ID" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const task = await Task.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!task) {
      return NextResponse.json(
        { message: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("DELETE task error:", error);

    return NextResponse.json(
      { message: "Failed to delete task" },
      { status: 500 }
    );
  }
}
