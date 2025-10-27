# Búsqueda de Movimientos, Tipos y Habilidades

Estas queries permiten buscar movimientos, tipos y habilidades en la base de datos, trayendo los Pokémon relacionados.

> **Nota**: Estas búsquedas solo funcionan con datos ya guardados en la BD. La PokeAPI no soporta este tipo de búsquedas.

---

## 1. Buscar Movimientos

Busca movimientos por nombre (parcial o completo) y retorna los Pokémon que aprenden ese movimiento.

### Query

```graphql
query SearchMoves {
  searchMoves(query: "razor", page: 1, limit: 10) {
    id
    name
    power
    pp
    priority
    accuracy
    type {
      name
    }
    pokemons {
      id
      pokedexNumber
      name
      types {
        name
      }
    }
  }
}
```

### Parámetros

- **query** (requerido): Texto a buscar en el nombre del movimiento (case-insensitive)
- **page** (opcional, default: 1): Número de página para paginación
- **limit** (opcional, default: 10): Cantidad máxima de resultados por página

### Ejemplos de búsqueda

```graphql
# Buscar movimientos que contengan "razor"
query {
  searchMoves(query: "razor", limit: 5) {
    name
    pokemons { name }
  }
}

# Buscar movimientos que contengan "thunder"
query {
  searchMoves(query: "thunder", limit: 10, offset: 0) {
    name
    power
    type { name }
    pokemons { name pokedexNumber }
  }
}

# Buscar movimientos que contengan "punch"
query {
  searchMoves(query: "punch", limit: 20) {
    name
    power
    pp
    pokemons { name }
  }
}
```

### Respuesta esperada

```json
{
  "data": {
    "searchMoves": [
      {
        "id": 10,
        "name": "razor-wind",
        "power": 80,
        "pp": 10,
        "priority": 0,
        "accuracy": 100,
        "type": {
          "name": "normal"
        },
        "pokemons": [
          {
            "id": 1,
            "pokedexNumber": 1,
            "name": "bulbasaur",
            "types": [
              { "name": "grass" },
              { "name": "poison" }
            ]
          },
          {
            "id": 2,
            "pokedexNumber": 2,
            "name": "ivysaur",
            "types": [
              { "name": "grass" },
              { "name": "poison" }
            ]
          }
        ]
      }
    ]
  }
}
```

---

## 2. Buscar Tipos

Busca tipos por nombre y retorna los Pokémon que tienen ese tipo.

### Query

```graphql
query SearchTypes {
  searchTypes(query: "fire", page: 1, limit: 10) {
    id
    name
    pokemons {
      id
      pokedexNumber
      name
      types {
        name
      }
      abilities {
        name
      }
    }
  }
}
```

### Parámetros

- **query** (requerido): Texto a buscar en el nombre del tipo (case-insensitive)
- **page** (opcional, default: 1): Número de página para paginación
- **limit** (opcional, default: 10): Cantidad máxima de resultados por página

### Ejemplos de búsqueda

```graphql
# Buscar tipo "fire"
query {
  searchTypes(query: "fire", limit: 5) {
    name
    pokemons { name pokedexNumber }
  }
}

# Buscar tipo "water"
query {
  searchTypes(query: "water", limit: 10) {
    name
    pokemons {
      name
      pokedexNumber
      types { name }
    }
  }
}

# Buscar tipo "grass"
query {
  searchTypes(query: "grass") {
    name
    pokemons { name }
  }
}
```

### Respuesta esperada

```json
{
  "data": {
    "searchTypes": [
      {
        "id": 10,
        "name": "fire",
        "pokemons": [
          {
            "id": 4,
            "pokedexNumber": 4,
            "name": "charmander",
            "types": [
              { "name": "fire" }
            ],
            "abilities": [
              { "name": "blaze" }
            ]
          },
          {
            "id": 5,
            "pokedexNumber": 5,
            "name": "charmeleon",
            "types": [
              { "name": "fire" }
            ],
            "abilities": [
              { "name": "blaze" }
            ]
          }
        ]
      }
    ]
  }
}
```

---

## 3. Buscar Habilidades

Busca habilidades por nombre y retorna los Pokémon que tienen esa habilidad.

### Query

```graphql
query SearchAbilities {
  searchAbilities(query: "overgrow", page: 1, limit: 10) {
    id
    name
    pokemons {
      id
      pokedexNumber
      name
      types {
        name
      }
      abilities {
        name
      }
    }
  }
}
```

### Parámetros

- **query** (requerido): Texto a buscar en el nombre de la habilidad (case-insensitive)
- **page** (opcional, default: 1): Número de página para paginación
- **limit** (opcional, default: 10): Cantidad máxima de resultados por página

### Ejemplos de búsqueda

```graphql
# Buscar habilidad "overgrow"
query {
  searchAbilities(query: "overgrow", limit: 5) {
    name
    pokemons { name pokedexNumber }
  }
}

# Buscar habilidad "blaze"
query {
  searchAbilities(query: "blaze", limit: 10) {
    name
    pokemons {
      name
      pokedexNumber
      types { name }
    }
  }
}

# Buscar habilidad que contenga "torrent"
query {
  searchAbilities(query: "torrent") {
    name
    pokemons { name }
  }
}
```

### Respuesta esperada

```json
{
  "data": {
    "searchAbilities": [
      {
        "id": 65,
        "name": "overgrow",
        "pokemons": [
          {
            "id": 1,
            "pokedexNumber": 1,
            "name": "bulbasaur",
            "types": [
              { "name": "grass" },
              { "name": "poison" }
            ],
            "abilities": [
              { "name": "overgrow" }
            ]
          },
          {
            "id": 2,
            "pokedexNumber": 2,
            "name": "ivysaur",
            "types": [
              { "name": "grass" },
              { "name": "poison" }
            ],
            "abilities": [
              { "name": "overgrow" }
            ]
          }
        ]
      }
    ]
  }
}
```

---

## Queries SQL Equivalentes

### Buscar movimientos

```sql
SELECT 
  m.id,
  m.name,
  m.power,
  m.pp,
  m.priority,
  m.accuracy,
  t.name as type_name,
  COUNT(DISTINCT pm."pokemonId") as pokemon_count
FROM "Move" m
JOIN "Type" t ON m."typeId" = t.id
LEFT JOIN "PokemonMove" pm ON m.id = pm."moveId"
WHERE LOWER(m.name) LIKE LOWER('%razor%')
GROUP BY m.id, m.name, m.power, m.pp, m.priority, m.accuracy, t.name
ORDER BY m.name
LIMIT 10;
```

### Buscar tipos

```sql
SELECT 
  t.id,
  t.name,
  COUNT(DISTINCT pt."pokemonId") as pokemon_count
FROM "Type" t
LEFT JOIN "PokemonType" pt ON t.id = pt."typeId"
WHERE LOWER(t.name) LIKE LOWER('%fire%')
GROUP BY t.id, t.name
ORDER BY t.name
LIMIT 10;
```

### Buscar habilidades

```sql
SELECT 
  a.id,
  a.name,
  COUNT(DISTINCT pa."pokemonId") as pokemon_count
FROM "Ability" a
LEFT JOIN "PokemonAbility" pa ON a.id = pa."abilityId"
WHERE LOWER(a.name) LIKE LOWER('%overgrow%')
GROUP BY a.id, a.name
ORDER BY a.name
LIMIT 10;
```

---

## Casos de Uso

### 1. Encontrar todos los Pokémon que aprenden un movimiento específico

```graphql
query {
  searchMoves(query: "thunderbolt", limit: 1) {
    name
    pokemons {
      name
      pokedexNumber
      types { name }
    }
  }
}
```

### 2. Encontrar todos los Pokémon de un tipo específico

```graphql
query {
  searchTypes(query: "psychic", limit: 1) {
    name
    pokemons {
      name
      pokedexNumber
      abilities { name }
    }
  }
}
```

### 3. Encontrar todos los Pokémon con una habilidad específica

```graphql
query {
  searchAbilities(query: "levitate", limit: 1) {
    name
    pokemons {
      name
      pokedexNumber
      types { name }
    }
  }
}
```

### 4. Búsqueda parcial (letra inicial)

```graphql
# Todos los movimientos que comienzan con "s"
query {
  searchMoves(query: "s", limit: 20) {
    name
    power
  }
}

# Todos los tipos que comienzan con "p"
query {
  searchTypes(query: "p", limit: 20) {
    name
  }
}

# Todas las habilidades que comienzan con "a"
query {
  searchAbilities(query: "a", limit: 20) {
    name
  }
}
```

---

## Notas Importantes

1. **Case-insensitive**: Las búsquedas no distinguen entre mayúsculas y minúsculas
2. **Búsqueda parcial**: Busca cualquier coincidencia dentro del nombre, no solo al inicio
3. **Paginación**: Usa `limit` y `offset` para paginar resultados
4. **Solo BD**: Estas búsquedas solo funcionan con datos ya guardados en la base de datos
5. **Performance**: Los índices en BD aseguran búsquedas rápidas incluso con muchos registros

---

## Troubleshooting

### No hay resultados

**Causa**: El movimiento/tipo/habilidad no existe en la BD

**Solución**: 
1. Primero busca un Pokémon que tenga ese movimiento/tipo/habilidad
2. Luego intenta la búsqueda nuevamente

### Búsqueda lenta

**Causa**: Falta de índices en BD

**Solución**: Los índices ya están creados. Si aún es lenta, verifica que la BD tiene suficientes recursos.

### Pokémon sin relaciones

**Causa**: El Pokémon fue guardado sin movimientos/tipos/habilidades

**Solución**: Busca el Pokémon por nombre para que se actualice desde PokeAPI.
