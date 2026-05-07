CREATE TABLE "rooms" (
  "id" integer PRIMARY KEY,
  "title" varchar,
  "description" text,
  "capacity_limit" integer,
  "is_mandatory_new_recruit" boolean DEFAULT false,
  "location_name" varchar,
  "location_address" varchar,
  "started_at" timestamp,
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "users" (
  "id" integer PRIMARY KEY,
  "email" varchar UNIQUE,
  "password" varchar,
  "username" varchar,
  "department" varchar,
  "user_type" varchar,
  "is_support_used" boolean DEFAULT false,
  "is_admin" boolean DEFAULT false,
  "allergies" varchar[],
  "created_at" timestamp,
  "updated_at" timestamp
);

CREATE TABLE "user_rooms" (
  "user_id" integer NOT NULL,
  "room_id" integer NOT NULL,
  "is_owner" boolean DEFAULT false,
  "created_at" timestamp,
  "updated_at" timestamp,
  PRIMARY KEY ("user_id", "room_id")
);

CREATE TABLE "messages" (
  "id" integer PRIMARY KEY,
  "user_id" integer NOT NULL,
  "room_id" integer NOT NULL,
  "content" text,
  "created_at" timestamp
);

ALTER TABLE "user_rooms" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "user_rooms" ADD FOREIGN KEY ("room_id") REFERENCES "rooms" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "messages" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "messages" ADD FOREIGN KEY ("room_id") REFERENCES "rooms" ("id") DEFERRABLE INITIALLY IMMEDIATE;
