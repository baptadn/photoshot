-- CreateEnum
CREATE TYPE "HdStatus" AS ENUM ('NO', 'PENDING', 'PROCESSED');

-- AlterTable
ALTER TABLE "Shot" ADD COLUMN     "hdStatus" "HdStatus" NOT NULL DEFAULT 'NO';
