ALTER TABLE "votes" DROP CONSTRAINT "votes_creator_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "votes" DROP COLUMN IF EXISTS "creator_id";