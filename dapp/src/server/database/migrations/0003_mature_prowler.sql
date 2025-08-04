PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_votes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer NOT NULL,
	`proposalId` integer NOT NULL,
	`voteCast` text,
	`elifAmount` real DEFAULT 0 NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`proposalId`) REFERENCES `proposals`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_votes`("id", "userId", "proposalId", "voteCast", "elifAmount") SELECT "id", "userId", "proposalId", "voteCast", "elifAmount" FROM `votes`;--> statement-breakpoint
DROP TABLE `votes`;--> statement-breakpoint
ALTER TABLE `__new_votes` RENAME TO `votes`;--> statement-breakpoint
PRAGMA foreign_keys=ON;