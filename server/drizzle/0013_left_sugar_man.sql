ALTER TABLE "polls" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "polls" ALTER COLUMN "expiration_data" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "votes" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;