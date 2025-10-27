-- 1. Índices (ya creados automáticamente por Prisma en algunos casos)
CREATE INDEX IF NOT EXISTS "Pokemon_name_idx" ON "Pokemon" (LOWER("name"));
CREATE INDEX IF NOT EXISTS "Type_name_idx" ON "Type" (LOWER("name"));
CREATE INDEX IF NOT EXISTS "Ability_name_idx" ON "Ability" (LOWER("name"));

-- 2. Trigger para validar tipos por Pokémon (1-2 tipos)
CREATE OR REPLACE FUNCTION fn_validate_pokemon_types()
RETURNS TRIGGER AS $$
DECLARE
  cnt INT;
BEGIN
  SELECT COUNT(*) INTO cnt FROM "PokemonType" WHERE "pokemonId" = COALESCE(NEW."pokemonId", OLD."pokemonId");
  
  IF TG_OP = 'INSERT' THEN
    cnt := cnt + 1;
  ELSIF TG_OP = 'DELETE' THEN
    cnt := cnt - 1;
  END IF;

  IF cnt < 1 THEN
    RAISE EXCEPTION 'Cada pokemon debe tener al menos 1 tipo (found %)', cnt;
  ELSIF cnt > 2 THEN
    RAISE EXCEPTION 'Cada pokemon puede tener máximo 2 tipos (found %)', cnt;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_pokemon_types_after_insdel
AFTER INSERT OR DELETE ON "PokemonType"
FOR EACH ROW EXECUTE FUNCTION fn_validate_pokemon_types();

-- 3. Trigger para validar habilidades (1-3 habilidades, sin requerir exactamente 1 oculta)
CREATE OR REPLACE FUNCTION fn_validate_pokemon_abilities()
RETURNS TRIGGER AS $$
DECLARE
  total INT;
  pid INT := COALESCE(NEW."pokemonId", OLD."pokemonId");
BEGIN
  SELECT COUNT(*) INTO total FROM "PokemonAbility" WHERE "pokemonId" = pid;

  IF TG_OP = 'INSERT' THEN
    total := total + 1;
  ELSIF TG_OP = 'DELETE' THEN
    total := total - 1;
  END IF;

  IF total < 1 THEN
    RAISE EXCEPTION 'Cada pokemon debe tener al menos 1 habilidad (found %)', total;
  ELSIF total > 3 THEN
    RAISE EXCEPTION 'Cada pokemon puede tener máximo 3 habilidades (found %)', total;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_pokemon_abilities_after_insdel
AFTER INSERT OR DELETE OR UPDATE OF "isHidden" ON "PokemonAbility"
FOR EACH ROW EXECUTE FUNCTION fn_validate_pokemon_abilities();

-- 4. Trigger para validar tamaño de equipo (máx 6 pokémons)
CREATE OR REPLACE FUNCTION fn_validate_team_size()
RETURNS TRIGGER AS $$
DECLARE
  cnt INT;
  tid INT := COALESCE(NEW."teamId", OLD."teamId");
BEGIN
  SELECT COUNT(*) INTO cnt FROM "TeamPokemon" WHERE "teamId" = tid;
  
  IF TG_OP = 'INSERT' THEN
    cnt := cnt + 1;
  ELSIF TG_OP = 'DELETE' THEN
    cnt := cnt - 1;
  END IF;

  IF cnt > 6 THEN
    RAISE EXCEPTION 'Un equipo no puede tener más de 6 pokemons (found %)', cnt;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_team_pokemons_after_insdel
AFTER INSERT OR DELETE ON "TeamPokemon"
FOR EACH ROW EXECUTE FUNCTION fn_validate_team_size();