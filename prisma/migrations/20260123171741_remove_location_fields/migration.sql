/*
  Warnings:

  - You are about to drop the column `area` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `province` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "area",
DROP COLUMN "city",
DROP COLUMN "province";
