-- CreateEnum
CREATE TYPE "LogStatus" AS ENUM ('PROCESSED', 'FAILED');

-- AlterTable
ALTER TABLE "Log" ADD COLUMN     "status" "LogStatus" NOT NULL DEFAULT 'PROCESSED';
