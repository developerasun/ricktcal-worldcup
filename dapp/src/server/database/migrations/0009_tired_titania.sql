CREATE TABLE `rewards` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`proposalId` integer NOT NULL,
	`pointAmount` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`proposalId`) REFERENCES `proposals`(`id`) ON UPDATE no action ON DELETE no action
);
