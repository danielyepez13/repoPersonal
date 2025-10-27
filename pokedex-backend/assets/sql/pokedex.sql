-- 1) Tablas de referencia (types, stats, abilities)
CREATE TABLE types (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE stats (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  sort_order INT NOT NULL
);

CREATE TABLE abilities (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT
);

-- 2) Pokemons
CREATE TABLE pokemons (
  id SERIAL PRIMARY KEY,
  pokedex_number INT NOT NULL UNIQUE, -- el "id (numero de pokedex)" que pediste
  name TEXT NOT NULL,
  height INT, -- unidades según PokeAPI (decimetros)
  weight INT, -- unidades según PokeAPI (hectogramos)
  sprite_url TEXT, -- ruta/URL al icono
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3) Estadísticas (pivot)
CREATE TABLE pokemon_stats (
  pokemon_id INT NOT NULL REFERENCES pokemons(id) ON DELETE CASCADE,
  stat_id INT NOT NULL REFERENCES stats(id) ON DELETE RESTRICT,
  base_stat INT NOT NULL,
  effort INT DEFAULT 0,
  PRIMARY KEY (pokemon_id, stat_id)
);

-- 4) Tipos y su relación muchos-a-muchos (máx 2 por pokemon)
CREATE TABLE pokemon_types (
  pokemon_id INT NOT NULL REFERENCES pokemons(id) ON DELETE CASCADE,
  type_id INT NOT NULL REFERENCES types(id) ON DELETE RESTRICT,
  slot SMALLINT NOT NULL CHECK (slot IN (1,2)), -- orden: 1 = primer tipo, 2 = segundo tipo
  PRIMARY KEY (pokemon_id, slot),
  UNIQUE (pokemon_id, type_id)
);

-- 5) Habilidades y pivot (min 1 - max 3, 1 debe ser oculta)
CREATE TABLE pokemon_abilities (
  pokemon_id INT NOT NULL REFERENCES pokemons(id) ON DELETE CASCADE,
  ability_id INT NOT NULL REFERENCES abilities(id) ON DELETE RESTRICT,
  slot SMALLINT NOT NULL CHECK (slot >= 1 AND slot <= 3),
  is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (pokemon_id, slot),
  UNIQUE (pokemon_id, ability_id)
);

-- 6) Equipos y miembros (max 6 por equipo)
CREATE TABLE teams (
  id SERIAL PRIMARY KEY,
  owner_id INT, -- opcional: referencia a users si tienes tabla users
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE team_pokemons (
  team_id INT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  slot SMALLINT NOT NULL CHECK (slot >= 1 AND slot <= 6),
  pokemon_id INT NOT NULL REFERENCES pokemons(id) ON DELETE RESTRICT,
  nickname TEXT,
  level SMALLINT CHECK (level >= 1 AND level <= 100) DEFAULT 100,
  PRIMARY KEY (team_id, slot)
);

-- 7) Matriz de efectividad entre tipos (resistencia, inmunidad, efectividad)
CREATE TABLE type_effectiveness (
  attacker_type_id INT NOT NULL REFERENCES types(id) ON DELETE CASCADE,
  defender_type_id INT NOT NULL REFERENCES types(id) ON DELETE CASCADE,
  multiplier NUMERIC(3,2) NOT NULL CHECK (multiplier >= 0),
  PRIMARY KEY (attacker_type_id, defender_type_id)
);
-- multiplier típico: 0.0 (inmune), 0.5 (no muy efectivo), 1.0 (neutral), 2.0 (super efectivo)

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

-- 3. Trigger para validar habilidades (1-3 habilidades, 1 oculta)
CREATE OR REPLACE FUNCTION fn_validate_pokemon_abilities()
RETURNS TRIGGER AS $$
DECLARE
  total INT;
  hidden_count INT;
  pid INT := COALESCE(NEW."pokemonId", OLD."pokemonId");
BEGIN
  SELECT COUNT(*) INTO total FROM "PokemonAbility" WHERE "pokemonId" = pid;
  SELECT COUNT(*) INTO hidden_count FROM "PokemonAbility" WHERE "pokemonId" = pid AND "isHidden" = true;

  IF TG_OP = 'INSERT' THEN
    total := total + 1;
    IF NEW."isHidden" THEN
      hidden_count := hidden_count + 1;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    total := total - 1;
    IF OLD."isHidden" THEN
      hidden_count := hidden_count - 1;
    END IF;
  END IF;

  IF total < 1 THEN
    RAISE EXCEPTION 'Cada pokemon debe tener al menos 1 habilidad (found %)', total;
  ELSIF total > 3 THEN
    RAISE EXCEPTION 'Cada pokemon puede tener máximo 3 habilidades (found %)', total;
  END IF;

  IF hidden_count <> 1 THEN
    RAISE EXCEPTION 'Cada pokemon debe tener exactamente 1 habilidad oculta (found %)', hidden_count;
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