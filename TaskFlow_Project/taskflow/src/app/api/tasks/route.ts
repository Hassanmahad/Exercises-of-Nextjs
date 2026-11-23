
import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { createTaskSchema } from "@/lib/validations/task";

import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Task from "@/models/Task";

// GET: Fetch logged-in user's tasks
export async function GET() {
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

    await connectToDatabase();

    const tasks = await Task.find({
      userId: session.user.id,
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error("GET tasks error:", error);

    return NextResponse.json(
      { message: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST: Create a new task

export async function POST(request: Request) {
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

    const body = await request.json();

    // Validate incoming data with Zod
    const validation = createTaskSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const validatedData = validation.data;

    await connectToDatabase();

    const task = await Task.create({
      ...validatedData,
      dueDate: validatedData.dueDate
        ? new Date(validatedData.dueDate)
        : null,
      userId: session.user.id,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Task created successfully",
        task,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST task error:", error);

    return NextResponse.json(
      { message: "Failed to create task" },
      { status: 500 }
    );
  }
}

