CREATE TABLE `desks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`label` text NOT NULL,
	`tags` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `reservations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`desk_id` integer NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`desk_id`) REFERENCES `desks`(`id`) ON UPDATE no action ON DELETE no action
);
