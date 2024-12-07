-- CreateEnum
CREATE TYPE "ProjectVersion" AS ENUM ('V1', 'V2');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "version" "ProjectVersion" NOT NULL DEFAULT 'V1';
