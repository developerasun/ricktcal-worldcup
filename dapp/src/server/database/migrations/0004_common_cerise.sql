CREATE TABLE `votes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer,
	`proposalId` integer,
	`voteCast` text DEFAULT 'left' NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`proposalId`) REFERENCES `proposals`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "votecast_type" CHECK("votes"."voteCast" IN ('left', 'right'))
);
