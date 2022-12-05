/*
  Warnings:

  - Added the required column `instanceClass` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instanceName` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "instanceClass" TEXT NOT NULL,
ADD COLUMN     "instanceName" TEXT NOT NULL;
