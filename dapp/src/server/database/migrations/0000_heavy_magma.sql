CREATE TABLE `points` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer,
	`score` integer DEFAULT 0 NOT NULL,
	`action` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "action_type" CHECK("points"."action" IN ('cheekpulling', 'headpat'))
);
--> statement-breakpoint
CREATE TABLE `proposals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer,
	`isActive` integer DEFAULT 0 NOT NULL,
	`status` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`startAt` text,
	`endAt` text,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "status_type" CHECK("proposals"."status" IN ('active', 'approved', 'rejected')),
	CONSTRAINT "activeness_type" CHECK("proposals"."isActive" IN (0, 1))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `proposals_title_unique` ON `proposals` (`title`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`wallet` text(42) NOT NULL,
	`nickname` text DEFAULT '게스트' NOT NULL,
	`point` integer DEFAULT 0 NOT NULL,
	`elif` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_nickname_unique` ON `users` (`nickname`);