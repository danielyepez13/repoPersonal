/*
  Warnings:

  - A unique constraint covering the columns `[pokeApiId]` on the table `Move` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pokeApiId` to the `Move` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Move" ADD COLUMN     "pokeApiId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Move_pokeApiId_key" ON "Move"("pokeApiId");
