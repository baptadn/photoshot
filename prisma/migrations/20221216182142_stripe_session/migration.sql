/*
  Warnings:

  - Added the required column `stripeSessionId` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "stripeSessionId" TEXT NOT NULL;
