ALTER TABLE `proposals` ADD `leftCharacterElif` real DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `proposals` ADD `rightCharacterElif` real DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `votes` ADD `elifAmount` real DEFAULT 0 NOT NULL;