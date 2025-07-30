PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_exchanges` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer,
	`pointAmount` integer DEFAULT 0 NOT NULL,
	`elifAmount` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_exchanges`("id", "userId", "pointAmount", "elifAmount") SELECT "id", "userId", "pointAmount", "elifAmount" FROM `exchanges`;--> statement-breakpoint
DROP TABLE `exchanges`;--> statement-breakpoint
ALTER TABLE `__new_exchanges` RENAME TO `exchanges`;--> statement-breakpoint
PRAGMA foreign_keys=ON;