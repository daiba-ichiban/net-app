import db from "@/db";
import { profile, insertProfileSchema } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { toCryptoPass, utcSystemDatetime } from "../_utils";

export type { Profile, ProfileInsertParam, ProfileServiceError };
export {
  findOneProfileByEmail,
  findOneProfileById,
  findAllActiveProfiles,
  createProfile,
  createProfiles,
  updateProfile,
  removeProfileByEmail,
};

type Profile = typeof profile.$inferSelect;
type ProfileInsertParam = typeof profile.$inferInsert;
type ProfileServiceError = { status: number; error: any };

const emailSchema = z.string().email();

const joinColumns = {
  with: {
    tasksCreatedBy: {
      columns: {
        id: true,
        title: true,
        content: true,
        memo: true,
        status: true,
        startAt: true,
        deadline: true,
        notificationDatetime: true,
      },
      with: {
        creator: { columns: { id: true, name: true, role: true } },
        assigner: { columns: { id: true, name: true, role: true } },
      },
    },
    tasksAsAssignerBy: {
      columns: {
        id: true,
        title: true,
        content: true,
        memo: true,
        status: true,
        startAt: true,
        deadline: true,
        notificationDatetime: true,
      },
      with: {
        creator: { columns: { id: true, name: true, role: true } },
        assigner: { columns: { id: true, name: true, role: true } },
      },
    },
    tasksAsAssigneeTo: {
      columns: {
        id: false,
        taskId: false,
        assigneeId: false,
        createdAt: false,
      },
      with: {
        task: {
          columns: {
            id: true,
            title: true,
            content: true,
            memo: true,
            status: true,
            startAt: true,
            deadline: true,
            notificationDatetime: true,
          },
          with: {
            creator: { columns: { id: true, name: true, role: true } },
            assigner: { columns: { id: true, name: true, role: true } },
          },
        },
      },
    },
  },
};

const findOneProfileByEmail = async (
  email: string
): Promise<Profile | ProfileServiceError | undefined> => {
  const validated = emailSchema.safeParse(email);
  if (!validated.success) return { status: 400, error: validated.error.errors };
  const data = await db.query.profile.findFirst({
    where: eq(profile.email, email),
    ...joinColumns,
  });

  return data;
};

const findOneProfileById = async (
  id: number
): Promise<Profile | ProfileServiceError> => {
  const p = await db.query.profile.findFirst({
    where: and(eq(profile.id, id), eq(profile.active, true)),
    ...joinColumns,
  });
  if (!p) return { status: 404, error: `Not found id:${id} profile.` };

  return p;
};

const findAllActiveProfiles = async (
  active: boolean = true
): Promise<Profile[]> => {
  const whereCond = active && { where: eq(profile.active, true) };
  const profiles = await db.query.profile.findMany({
    ...whereCond,
    ...joinColumns,
    orderBy: profile.id,
  });
  return profiles;
};

const createProfile = async (
  p: ProfileInsertParam
): Promise<Profile | ProfileServiceError> => {
  const validated = insertProfileSchema.safeParse(p);
  if (!validated.success) return { status: 400, error: validated.error.errors };
  const dupeProf = await findOneProfileByEmail(p.email);
  if (dupeProf !== undefined)
    return { status: 409, error: `${p.email} profile is already exist.` };

  p.password = toCryptoPass(p.password);
  const created = await db.insert(profile).values(p).returning();
  return created[0];
};

const createProfiles = async (p: ProfileInsertParam[]): Promise<Profile[]> => {
  const created = await db.insert(profile).values(p).returning();
  return created;
};

const updateProfile = async (p: Profile): Promise<Profile[]> => {
  const updated = await db
    .update(profile)
    .set({
      name: p.name,
      email: p.email,
      role: p.role,
      updatedAt: p.updatedAt || utcSystemDatetime(),
    })
    .where(eq(profile.email, p.email))
    .returning();

  return updated;
};

const removeProfileByEmail = async (
  email: string,
  removePhysical: boolean = false
) => {
  const validated = emailSchema.safeParse(email);
  if (!validated.success) return { status: 400, error: validated.error.errors };

  const p = await findOneProfileByEmail(email);
  if (!p) return { status: 404, error: `Not found email:${email} profile.` };

  const removed = removePhysical
    ? await db.delete(profile).where(eq(profile.email, email)).returning()
    : await db
        .update(profile)
        .set({
          active: false,
          updatedAt: utcSystemDatetime(),
        })
        .where(eq(profile.email, email))
        .returning();
  return removed;
};
