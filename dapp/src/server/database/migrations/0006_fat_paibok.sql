CREATE TABLE `onchains` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`txHash` text NOT NULL,
	`nonce` integer NOT NULL,
	`proposalId` integer,
	`exchangeId` integer,
	`action` text,
	`elifAmount` real DEFAULT 0 NOT NULL,
	FOREIGN KEY (`proposalId`) REFERENCES `proposals`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`exchangeId`) REFERENCES `exchanges`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `onchains_txHash_unique` ON `onchains` (`txHash`);