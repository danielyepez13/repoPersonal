-- AlterTable
ALTER TABLE "TeamPokemon" ADD COLUMN     "itemId" INTEGER,
ADD COLUMN     "natureId" INTEGER;

-- CreateTable
CREATE TABLE "Nature" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "decreasedStat" TEXT NOT NULL,
    "increasedStat" TEXT NOT NULL,

    CONSTRAINT "Nature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "sprite" TEXT,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Nature_name_key" ON "Nature"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Item_name_key" ON "Item"("name");

-- AddForeignKey
ALTER TABLE "TeamPokemon" ADD CONSTRAINT "TeamPokemon_natureId_fkey" FOREIGN KEY ("natureId") REFERENCES "Nature"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamPokemon" ADD CONSTRAINT "TeamPokemon_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;
