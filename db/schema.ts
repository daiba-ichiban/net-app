import { relations } from "drizzle-orm";
import {
  pgTable,
  bigserial,
  text,
  varchar,
  timestamp,
  bigint,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

const validRoles = ["ADMIN", "MANAGER", "USER", ""] as const;
type RoleType = (typeof validRoles)[number];

export const profile = pgTable("profiles", {
  id: bigserial("id", { mode: "number" }).primaryKey().notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 64 }).notNull(),
  role: varchar("role", { length: 50 }).$type<RoleType>().notNull(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
});

const PASSWORD_RULE =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-_+])[A-Za-z\d@$!%*?&-_+]{8,}$/;

export const insertProfileSchema = createInsertSchema(profile, {
  name: z.string().min(1).max(100),
  email: z.string().email().max(100),
  password: z.string().regex(PASSWORD_RULE).max(50),
  role: z.enum(validRoles),
});
export const selectProfileSchema = createSelectSchema(profile, {
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().max(100).optional(),
  password: z.string().regex(PASSWORD_RULE).max(50).optional(),
  role: z.enum(validRoles).optional(),
});

export const profileRelation = relations(profile, ({ many }) => ({
  tasksCreatedBy: many(task, {
    relationName: "creator_profile_task",
  }),
  tasksAsAssignerBy: many(task, {
    relationName: "assigner_profile_task",
  }),
  tasksAsAssigneeTo: many(taskAssignee, {
    relationName: "assignee_profile_taskAssignee",
  }),
}));

const validTaskStatus = [
  "CREATED",
  "ASSIGNING",
  "ASSIGNED",
  "IN_PROGRESS",
  "SUSPENDING",
  "PENDING",
  "COMPLETED",
  "TERMINATED",
] as const;
type ValidTaskStatus = (typeof validTaskStatus)[number];

export const task = pgTable("tasks", {
  id: bigserial("id", { mode: "number" }).primaryKey().notNull(),
  title: varchar("title", { length: 100 }).notNull(),
  content: text("content").notNull(),
  memo: text("memo"),
  startAt: timestamp("start_at", {
    withTimezone: true,
    mode: "string",
  }),
  deadline: timestamp("deadline", {
    withTimezone: true,
    mode: "string",
  }),
  notificationDatetime: timestamp("notification_datetime", {
    withTimezone: true,
    mode: "string",
  }),
  creatorId: bigint("creator_id", { mode: "number" })
    .references(() => profile.id, { onDelete: "cascade" })
    .notNull(),
  assignerId: bigint("assigner_id", { mode: "number" }).references(
    () => profile.id,
    { onDelete: "cascade" }
  ),
  status: varchar("status", { length: 50 }).$type<ValidTaskStatus>().notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
});

export const insertTaskSchema = createInsertSchema(task, {
  title: z.string().min(1),
  content: z.string().min(1),
  status: z.enum(validTaskStatus),
});
export const selectTaskSchema = createSelectSchema(task, {
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  status: z.enum(validTaskStatus).optional(),
});

export const taskRelation = relations(task, ({ one, many }) => ({
  creator: one(profile, {
    fields: [task.creatorId],
    references: [profile.id],
    relationName: "creator_profile_task",
  }),
  assigner: one(profile, {
    fields: [task.assignerId],
    references: [profile.id],
    relationName: "assigner_profile_task",
  }),
  assignees: many(taskAssignee, {
    relationName: "assignee_task_taskAssignee",
  }),
  taskTags: many(taskTag, {
    relationName: "",
  }),
}));

export const taskAssignee = pgTable("tasks_assignees", {
  id: bigserial("id", { mode: "number" }).primaryKey().notNull(),
  taskId: bigint("task_id", { mode: "number" })
    .references(() => task.id)
    .notNull(),
  assigneeId: bigint("assignee_id", { mode: "number" })
    .references(() => profile.id)
    .notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
});

export const taskAssigneeRelation = relations(taskAssignee, ({ one }) => ({
  task: one(task, {
    fields: [taskAssignee.taskId],
    references: [task.id],
    relationName: "assignee_task_taskAssignee",
  }),
  assignee: one(profile, {
    fields: [taskAssignee.assigneeId],
    references: [profile.id],
    relationName: "assignee_profile_taskAssignee",
  }),
}));

export const tag = pgTable("tags", {
  id: bigserial("id", { mode: "number" }).primaryKey().notNull(),
  tagName: varchar("tag_name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
});

export const tagRelation = relations(tag, ({ many }) => ({
  taskTag: many(taskTag),
}));

export const taskTag = pgTable("tasks_tags", {
  id: bigserial("id", { mode: "number" }).primaryKey().notNull(),
  taskId: bigint("task_id", { mode: "number" })
    .references(() => task.id)
    .notNull(),
  tagId: bigint("tag_id", { mode: "number" })
    .references(() => tag.id)
    .notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
});

export const taskTagRelation = relations(taskTag, ({ one }) => ({
  task: one(task, {
    fields: [taskTag.taskId],
    references: [task.id],
  }),
  tag: one(tag, {
    fields: [taskTag.tagId],
    references: [tag.id],
  }),
}));
