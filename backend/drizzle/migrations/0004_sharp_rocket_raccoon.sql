ALTER TABLE "listings" ALTER COLUMN "city" SET DATA TYPE integer USING ("city"::integer);--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_city_cities_id_fk" FOREIGN KEY ("city") REFERENCES "public"."cities"("id") ON DELETE no action ON UPDATE no action;
