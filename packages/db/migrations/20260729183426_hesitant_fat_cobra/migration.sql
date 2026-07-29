ALTER TABLE "account" RENAME COLUMN "account_id" TO "issuer";--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "provider_account_id" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "account_issuer_providerAccountId_uidx" ON "account" ("issuer","provider_account_id");