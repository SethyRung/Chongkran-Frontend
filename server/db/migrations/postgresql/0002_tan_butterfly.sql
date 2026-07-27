CREATE EXTENSION IF NOT EXISTS pg_trgm;--> statement-breakpoint
CREATE TABLE "recipe_views" (
	"recipe_id" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "recipe_views_recipe_id_user_id_pk" PRIMARY KEY("recipe_id","user_id")
);
--> statement-breakpoint
ALTER TABLE "recipe_views" ADD CONSTRAINT "recipe_views_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_views" ADD CONSTRAINT "recipe_views_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "recipe_views_recipe_idx" ON "recipe_views" USING btree ("recipe_id");--> statement-breakpoint
CREATE INDEX "recipes_title_trgm_idx" ON "recipes" USING gin (title gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "recipes_description_trgm_idx" ON "recipes" USING gin (description gin_trgm_ops);