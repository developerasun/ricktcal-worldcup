CREATE TABLE `exchanges` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer,
	`pointAmount` integer DEFAULT 0 NOT NULL,
	`elifAmount` real DEFAULT 0 NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `points` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer,
	`score` integer DEFAULT 0 NOT NULL,
	`action` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `proposals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`status` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`startAt` text,
	`endAt` text,
	`leftCharacterName` text DEFAULT '버터' NOT NULL,
	`rightCharacterName` text DEFAULT '코미' NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `proposals_title_unique` ON `proposals` (`title`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`wallet` text(42) NOT NULL,
	`nickname` text DEFAULT '게스트' NOT NULL,
	`point` integer DEFAULT 0 NOT NULL,
	`elif` real DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_nickname_unique` ON `users` (`nickname`);--> statement-breakpoint
CREATE TABLE `votes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer,
	`proposalId` integer,
	`voteCast` text,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`proposalId`) REFERENCES `proposals`(`id`) ON UPDATE no action ON DELETE no action
);
