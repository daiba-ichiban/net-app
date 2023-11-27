import {
  TaskInsertParam,
  TaskServiceError,
  createTask,
  findAllTasks,
} from "@/app/_services/TaskService";
import { insertTaskSchema } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const taskList = await findAllTasks();

  return NextResponse.json(taskList);
};

export const POST = async (req: NextRequest) => {
  const taskParam: TaskInsertParam = await req.json();
  const validated = insertTaskSchema.safeParse(taskParam);
  if (!validated.success)
    return NextResponse.json({ error: validated.error }, { status: 400 });

  const created = await createTask(taskParam);
  return NextResponse.json(created);
};
