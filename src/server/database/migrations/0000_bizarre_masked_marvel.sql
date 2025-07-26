CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`wallet` text(42) NOT NULL,
	`nickname` text DEFAULT '게스트' NOT NULL
);
