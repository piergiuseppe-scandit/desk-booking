import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core";

export const desks = sqliteTable('desks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  label: text('label').notNull(),
  tags: text('tags').notNull(), // Stored as JSON string
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const reservations = sqliteTable('reservations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull(),
  deskId: integer('desk_id').notNull().references(() => desks.id),
  startDate: text('start_date').notNull(),
  endDate: text('end_date').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});