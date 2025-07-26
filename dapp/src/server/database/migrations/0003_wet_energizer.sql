PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_proposals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId` integer,
	`isActive` integer DEFAULT 0 NOT NULL,
	`status` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`startAt` text,
	`endAt` text,
	`leftCharacterName` text DEFAULT '버터' NOT NULL,
	`rightCharacterName` text DEFAULT '코미' NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "status_type" CHECK("__new_proposals"."status" IN ('pending', 'active', 'approved', 'rejected')),
	CONSTRAINT "activeness_type" CHECK("__new_proposals"."isActive" IN (0, 1))
);
--> statement-breakpoint
INSERT INTO `__new_proposals`("id", "userId", "isActive", "status", "title", "description", "startAt", "endAt", "leftCharacterName", "rightCharacterName") SELECT "id", "userId", "isActive", "status", "title", "description", "startAt", "endAt", "leftCharacterName", "rightCharacterName" FROM `proposals`;--> statement-breakpoint
DROP TABLE `proposals`;--> statement-breakpoint
ALTER TABLE `__new_proposals` RENAME TO `proposals`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `proposals_title_unique` ON `proposals` (`title`);