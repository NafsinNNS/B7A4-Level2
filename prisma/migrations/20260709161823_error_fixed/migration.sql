/*
  Warnings:

  - You are about to drop the column `ApproveStatus` on the `RentalRequest` table. All the data in the column will be lost.
  - The `paymentStatus` column on the `RentalRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ApproveStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PAID', 'FAILED');

-- AlterTable
ALTER TABLE "RentalRequest" DROP COLUMN "ApproveStatus",
ADD COLUMN     "approveStatus" "ApproveStatus" NOT NULL DEFAULT 'PENDING',
DROP COLUMN "paymentStatus",
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID';
