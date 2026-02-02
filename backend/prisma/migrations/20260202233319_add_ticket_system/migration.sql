-- AlterTable
ALTER TABLE "User" ADD COLUMN     "ticketBalance" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "ticketLastPurchaseAt" TIMESTAMP(3),
ADD COLUMN     "ticketPurchaseHistory" JSONB NOT NULL DEFAULT '[]';
