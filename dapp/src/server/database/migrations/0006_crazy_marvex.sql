CREATE TABLE `exchanges` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer,
	`action` text NOT NULL,
	`pointAmount` integer DEFAULT 0 NOT NULL,
	`elifAmount` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "action_type" CHECK("exchanges"."action" IN ('cheekpulling', 'headpat'))
);
