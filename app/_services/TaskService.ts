import db from "@/db";
import { insertTaskSchema, profile, task } from "@/db/schema";

export type { Task, TaskInsertParam, TaskServiceError };

export { createTask, findAllTasks };

type Task = typeof task.$inferSelect;
type TaskInsertParam = typeof task.$inferInsert;
type TaskServiceError = { status: number; error: any };

const createTask = async (
  t: TaskInsertParam
): Promise<Task | TaskServiceError> => {
  const validated = insertTaskSchema.safeParse(t);
  if (!validated.success) return { status: 400, error: validated.error.errors };

  const created = await db.insert(task).values(t).returning();

  return created[0];
};

const findAllTasks = async (): Promise<Task[]> => {
  return await db.query.task.findMany({
    with: {
      creator: {
        columns: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      assigner: {
        columns: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      assignees: true,
    },
  });
};
