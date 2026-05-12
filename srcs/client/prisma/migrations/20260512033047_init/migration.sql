-- CreateTable
CREATE TABLE "departments" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "email" VARCHAR NOT NULL,
    "username" VARCHAR,
    "department_id" INTEGER,
    "user_type" VARCHAR,
    "is_support_used" BOOLEAN DEFAULT false,
    "is_admin" BOOLEAN DEFAULT false,
    "allergies" TEXT[],
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR NOT NULL,
    "description" TEXT,
    "capacity_limit" INTEGER,
    "is_mandatory_new_recruit" BOOLEAN DEFAULT false,
    "location_name" VARCHAR,
    "location_address" VARCHAR,
    "open_at" TIMESTAMPTZ(6),
    "close_at" TIMESTAMPTZ(6),
    "event_start_at" TIMESTAMPTZ(6),
    "event_end_at" TIMESTAMPTZ(6),
    "status" VARCHAR DEFAULT '募集中',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "user_id" UUID,
    "room_id" INTEGER,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_rooms" (
    "user_id" UUID NOT NULL,
    "room_id" INTEGER NOT NULL,
    "is_owner" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_rooms_pkey" PRIMARY KEY ("user_id","room_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_rooms" ADD CONSTRAINT "user_rooms_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_rooms" ADD CONSTRAINT "user_rooms_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
