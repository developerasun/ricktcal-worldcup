CREATE TABLE `pendings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`txHash` text NOT NULL,
	`nonce` integer NOT NULL,
	`userId` integer NOT NULL,
	`isConfirmed` integer DEFAULT 0 NOT NULL,
	`action` text NOT NULL,
	`proposalId` integer,
	`voteCast` text,
	`digest` text,
	`signature` text,
	`isLeftVote` text,
	`exchangeId` integer,
	`elifAmount` real DEFAULT 0 NOT NULL,
	`pointAmount` integer DEFAULT 0,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`proposalId`) REFERENCES `proposals`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`exchangeId`) REFERENCES `exchanges`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pendings_txHash_unique` ON `pendings` (`txHash`);