-- CreateTable
CREATE TABLE "Type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stat" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,

    CONSTRAINT "Stat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ability" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Ability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pokemon" (
    "id" SERIAL NOT NULL,
    "pokedexNumber" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "height" INTEGER,
    "weight" INTEGER,
    "spriteUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PokemonType" (
    "pokemonId" INTEGER NOT NULL,
    "typeId" INTEGER NOT NULL,
    "slot" INTEGER NOT NULL,

    CONSTRAINT "PokemonType_pkey" PRIMARY KEY ("pokemonId","slot")
);

-- CreateTable
CREATE TABLE "PokemonStat" (
    "pokemonId" INTEGER NOT NULL,
    "statId" INTEGER NOT NULL,
    "baseStat" INTEGER NOT NULL,
    "effort" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PokemonStat_pkey" PRIMARY KEY ("pokemonId","statId")
);

-- CreateTable
CREATE TABLE "PokemonAbility" (
    "pokemonId" INTEGER NOT NULL,
    "abilityId" INTEGER NOT NULL,
    "slot" INTEGER NOT NULL,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PokemonAbility_pkey" PRIMARY KEY ("pokemonId","slot")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamPokemon" (
    "teamId" INTEGER NOT NULL,
    "slot" INTEGER NOT NULL,
    "pokemonId" INTEGER NOT NULL,
    "nickname" TEXT,
    "level" INTEGER NOT NULL DEFAULT 100,

    CONSTRAINT "TeamPokemon_pkey" PRIMARY KEY ("teamId","slot")
);

-- CreateTable
CREATE TABLE "TypeEffectiveness" (
    "attackerTypeId" INTEGER NOT NULL,
    "defenderTypeId" INTEGER NOT NULL,
    "multiplier" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "TypeEffectiveness_pkey" PRIMARY KEY ("attackerTypeId","defenderTypeId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Type_name_key" ON "Type"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Stat_name_key" ON "Stat"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Ability_name_key" ON "Ability"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Pokemon_pokedexNumber_key" ON "Pokemon"("pokedexNumber");

-- CreateIndex
CREATE UNIQUE INDEX "PokemonType_pokemonId_typeId_key" ON "PokemonType"("pokemonId", "typeId");

-- CreateIndex
CREATE UNIQUE INDEX "PokemonAbility_pokemonId_abilityId_key" ON "PokemonAbility"("pokemonId", "abilityId");

-- AddForeignKey
ALTER TABLE "PokemonType" ADD CONSTRAINT "PokemonType_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonType" ADD CONSTRAINT "PokemonType_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonStat" ADD CONSTRAINT "PokemonStat_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonStat" ADD CONSTRAINT "PokemonStat_statId_fkey" FOREIGN KEY ("statId") REFERENCES "Stat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonAbility" ADD CONSTRAINT "PokemonAbility_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PokemonAbility" ADD CONSTRAINT "PokemonAbility_abilityId_fkey" FOREIGN KEY ("abilityId") REFERENCES "Ability"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamPokemon" ADD CONSTRAINT "TeamPokemon_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamPokemon" ADD CONSTRAINT "TeamPokemon_pokemonId_fkey" FOREIGN KEY ("pokemonId") REFERENCES "Pokemon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TypeEffectiveness" ADD CONSTRAINT "TypeEffectiveness_attackerTypeId_fkey" FOREIGN KEY ("attackerTypeId") REFERENCES "Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TypeEffectiveness" ADD CONSTRAINT "TypeEffectiveness_defenderTypeId_fkey" FOREIGN KEY ("defenderTypeId") REFERENCES "Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
