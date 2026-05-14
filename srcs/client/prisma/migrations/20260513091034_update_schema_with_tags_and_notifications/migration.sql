/*
  Warnings:

  - The `status` column on the `rooms` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `user_id` on table `messages` required. This step will fail if there are existing NULL values in that column.
  - Made the column `room_id` on table `messages` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('OPEN', 'CLOSED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('pending', 'success', 'failed');

-- AlterTable
ALTER TABLE "messages" ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "room_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "rooms" DROP COLUMN "status",
ADD COLUMN     "status" "RoomStatus" NOT NULL DEFAULT 'OPEN';

-- AlterTable
ALTER TABLE "user_rooms" ADD COLUMN     "joined_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "left_at" TIMESTAMPTZ(6);

-- CreateTable
CREATE TABLE "tags" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_tags" (
    "room_id" INTEGER NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "room_tags_pkey" PRIMARY KEY ("room_id","tag_id")
);

-- CreateTable
CREATE TABLE "notification_histories" (
    "id" BIGSERIAL NOT NULL,
    "target_date" DATE NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'pending',
    "room_count" INTEGER NOT NULL,
    "sent_at" TIMESTAMPTZ(6),
    "error_message" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_histories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE INDEX "notification_histories_target_date_idx" ON "notification_histories"("target_date");

-- CreateIndex
CREATE INDEX "user_rooms_left_at_idx" ON "user_rooms"("left_at");

-- AddForeignKey
ALTER TABLE "room_tags" ADD CONSTRAINT "room_tags_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_tags" ADD CONSTRAINT "room_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
