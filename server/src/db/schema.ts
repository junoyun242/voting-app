import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).unique().notNull(),
  password: varchar("password", { length: 100 }).notNull(),
  createdAt: timestamp("created_at", {
    mode: "string",
    withTimezone: true,
  }).defaultNow(),
});

export const pollsTable = pgTable("polls", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 50 }).notNull(),
  description: varchar("description", { length: 500 }).notNull(),
  token: varchar("token", { length: 100 }).notNull(),
  creatorID: integer("creator_id").references(() => usersTable.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at", {
    mode: "string",
    withTimezone: true,
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    mode: "string",
    withTimezone: true,
  }).defaultNow(),
  expirationDate: timestamp("expiration_data", {
    mode: "string",
    withTimezone: true,
  }),
});

export const optionsTable = pgTable("options", {
  id: serial("id").primaryKey(),
  option: varchar("option", { length: 50 }).notNull(),
  pollID: integer("poll_id")
    .references(() => pollsTable.id, { onDelete: "cascade" })
    .notNull(),
});

export const votesTable = pgTable("votes", {
  id: serial("id").primaryKey(),
  userID: integer("user_id").references(() => usersTable.id),
  optionID: integer("option_id")
    .references(() => optionsTable.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at", {
    mode: "string",
    withTimezone: true,
  }).defaultNow(),
});

export const pollCommentsTable = pgTable("poll_comments", {
  id: serial("id").primaryKey(),
  userID: integer("user_id").references(() => usersTable.id),
  nickname: varchar("username", { length: 50 }).notNull(),
  pollID: integer("poll_id")
    .references(() => pollsTable.id, { onDelete: "cascade" })
    .notNull(),
  content: varchar("content", { length: 100 }).notNull(),
  createdAt: timestamp("created_at", {
    mode: "string",
    withTimezone: true,
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    mode: "string",
    withTimezone: true,
  }).defaultNow(),
});

export type TUsersTable = typeof usersTable.$inferSelect;
export type TPollsTable = typeof pollsTable.$inferSelect;
export type TOptionsTable = typeof optionsTable.$inferSelect;
export type TVotesTable = typeof votesTable.$inferSelect;
export type TPollCommentsTable = typeof pollCommentsTable.$inferSelect;
