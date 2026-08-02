CREATE TABLE `portfolio_admins` (
	`user_id` text PRIMARY KEY NOT NULL,
	`email` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `portfolio_projects` (
	`slug` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`display_order` integer NOT NULL,
	`visible` integer DEFAULT true NOT NULL,
	`hero` integer DEFAULT false NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `portfolio_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
