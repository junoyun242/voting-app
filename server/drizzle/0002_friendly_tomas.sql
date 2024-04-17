ALTER TABLE "polls" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "votes" ADD COLUMN "created_at" timestamp DEFAULT now();