-- CreateTable
CREATE TABLE "Move" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "power" INTEGER,
    "pp" INTEGER,
    "priority" INTEGER,
    "accuracy" INTEGER,
    "typeId" INTEGER NOT NULL,

    CONSTRAINT "Move_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonMove" (
    "pokemonId" INTEGER NOT NULL,
    "moveId" INTEGER NOT NULL,
    "levelLearnedAt" INTEGER,
    "moveLearnMethod" TEXT,

    CONSTRAINT "PokemonMove_pkey" PRIMARY KEY ("pokemonId","moveId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Move_name_key" ON "Move"("name");

-- CreateIndex
CREATE INDEX "Move_name_idx" ON "Move"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PokemonMove_pokemonId_moveId_key" ON "PokemonMove"("pokemonId", "moveId");

-- AddForeignKey
ALTER TABLE "Move" ADD CONSTRAINT "Move_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonMove" ADD CONSTRAINT "PokemonMove_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonMove" ADD CONSTRAINT "PokemonMove_moveId_fkey" FOREIGN KEY ("moveId") REFERENCES "Move"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
