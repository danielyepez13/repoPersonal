# Búsqueda de Pokémon - Queries GraphQL

## Obtener Pokémon por ID

### Query: pokemonById

Obtiene un Pokémon específico por su ID de Pokédex.

```graphql
query {
  pokemonById(id: 1) {
    id
    pokedexNumber
    name
    height
    weight
    spriteUrl
    types {
      name
      slot
    }
    abilities {
      name
      slot
      isHidden
    }
    stats {
      name
      baseStat
    }
    moves {
      name
      power
      pp
      priority
      accuracy
      type {
        name
      }
    }
  }
}
```

**Parámetros:**
- `id` (requerido): ID del Pokémon (número de Pokédex)

**Ejemplos:**
```graphql
# Obtener Bulbasaur (ID: 1)
query { pokemonById(id: 1) { name types { name } } }

# Obtener Pikachu (ID: 25)
query { pokemonById(id: 25) { name abilities { name } } }

# Obtener con todos los detalles
query { pokemonById(id: 1) { name types { name } abilities { name } moves { name power } } }
```

**Características:**
- Búsqueda exacta por ID
- Retorna Pokémon con todas sus relaciones
- Si no existe en BD, busca en PokeAPI y guarda
- Actualiza automáticamente si relaciones están incompletas

---

## Búsqueda de Pokémon por Nombre

### Query: searchPokemons

Busca Pokémon por coincidencia parcial de nombre (case-insensitive).

```graphql
query {
  searchPokemons(query: "bu", limit: 10, offset: 0) {
    id
    pokedexNumber
    name
    height
    weight
    spriteUrl
    types {
      name
      slot
    }
    abilities {
      name
      slot
      isHidden
    }
    stats {
      name
      baseStat
    }
    moves {
      name
      power
      pp
      priority
      accuracy
      type {
        name
      }
    }
  }
}
```

**Parámetros:**
- `query` (requerido): Texto a buscar
- `limit` (opcional, default: 10): Resultados por página
- `offset` (opcional, default: 0): Desplazamiento

**Ejemplos:**
```graphql
# Buscar Pokémon que comienzan con "bu"
query { searchPokemons(query: "bu", limit: 5, offset: 0) { name } }

# Buscar "char" (encuentra Charmander, Charmeleon, Charizard)
query { searchPokemons(query: "char", limit: 10, offset: 0) { name } }

# Página 2 (offset: 10)
query { searchPokemons(query: "pika", limit: 10, offset: 10) { name } }
```

---

## Búsqueda de Movimientos

### Query: searchMoves

Busca movimientos por nombre y retorna los Pokémon que los aprenden.

```graphql
query {
  searchMoves(query: "thunder", page: 1, limit: 10) {
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

**Parámetros:**
- `query` (requerido): Texto a buscar
- `page` (opcional, default: 1): Número de página
- `limit` (opcional, default: 10): Resultados por página

**Ejemplos:**
```graphql
# Buscar movimientos que contienen "thunder"
query { searchMoves(query: "thunder", page: 1, limit: 10) { name power pokemons { name } } }

# Buscar "razor"
query { searchMoves(query: "razor", page: 1, limit: 5) { name pokemons { name } } }

# Página 2
query { searchMoves(query: "thunder", page: 2, limit: 10) { name } }
```

---

## Búsqueda de Tipos

### Query: searchTypes

Busca tipos de Pokémon por nombre y retorna los Pokémon que tienen ese tipo.

```graphql
query {
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
    }
  }
}
```

**Parámetros:**
- `query` (requerido): Texto a buscar
- `page` (opcional, default: 1): Número de página
- `limit` (opcional, default: 10): Resultados por página

**Ejemplos:**
```graphql
# Buscar tipo "fire"
query { searchTypes(query: "fire", page: 1, limit: 10) { name pokemons { name } } }

# Buscar tipo "water"
query { searchTypes(query: "water", page: 1, limit: 10) { name pokemons { name } } }

# Página 2
query { searchTypes(query: "fire", page: 2, limit: 10) { name } }
```

---

## Búsqueda de Habilidades

### Query: searchAbilities

Busca habilidades por nombre y retorna los Pokémon que las tienen.

```graphql
query {
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
    }
  }
}
```

**Parámetros:**
- `query` (requerido): Texto a buscar
- `page` (opcional, default: 1): Número de página
- `limit` (opcional, default: 10): Resultados por página

**Ejemplos:**
```graphql
# Buscar habilidad "overgrow"
query { searchAbilities(query: "overgrow", page: 1, limit: 10) { name pokemons { name } } }

# Buscar habilidad "blaze"
query { searchAbilities(query: "blaze", page: 1, limit: 10) { name pokemons { name } } }

# Página 2
query { searchAbilities(query: "overgrow", page: 2, limit: 10) { name } }
```

---

## Obtener Detalles de un Movimiento

### Query: moveById

Obtiene detalles completos de un movimiento incluyendo todos los Pokémon que lo aprenden.

```graphql
query {
  moveById(id: 1) {
    id
    name
    power
    pp
    priority
    accuracy
    category
    type {
      id
      name
    }
    pokemons {
      id
      pokedexNumber
      name
      spriteUrl
      types {
        name
        slot
      }
      abilities {
        name
        slot
        isHidden
      }
      stats {
        name
        baseStat
      }
    }
  }
}
```

**Parámetros:**
- `id` (requerido): ID del movimiento

**Ejemplos:**
```graphql
# Obtener detalles del movimiento "Tackle" (ID: 1)
query { moveById(id: 1) { name power category type { name } pokemons { name } } }

# Obtener movimiento con todos los detalles
query { moveById(id: 1) { name power pp accuracy category type { name } pokemons { name types { name } } } }
```

**Características:**
- Retorna detalles completos del movimiento: power, pp, priority, accuracy, category
- Retorna tipo del movimiento
- Retorna lista de Pokémon que aprenden el movimiento
- Cada Pokémon incluye tipos, habilidades y estadísticas
- Pokémon ordenados por pokedexNumber

---

## Resumen de Búsquedas

| Query | Tipo | Busca | Retorna |
|-------|------|-------|---------|
| `pokemonById` | Query | Pokémon por ID | Pokémon con relaciones |
| `pokemon` | Query | Pokémon por nombre exacto | Pokémon con relaciones |
| `searchPokemons` | Query | Pokémon por nombre parcial | Pokémon con relaciones |
| **`moveById`** | **Query** | **Movimiento por ID** | **Movimiento + Pokémon** |
| `searchMoves` | Query | Movimientos por nombre | Movimientos + Pokémon |
| `searchTypes` | Query | Tipos por nombre | Tipos + Pokémon |
| `searchAbilities` | Query | Habilidades por nombre | Habilidades + Pokémon |

---

## Características de Búsqueda

✅ **Case-insensitive:** Busca sin importar mayúsculas/minúsculas  
✅ **Búsqueda parcial:** "bu" encuentra "bulbasaur", "bunnelby", etc.  
✅ **Paginación:** Control de resultados con `page`/`limit` u `offset`  
✅ **Índices en BD:** Búsquedas rápidas en base de datos  
✅ **Relaciones completas:** Retorna datos relacionados  
✅ **Solo BD:** No busca en PokeAPI (datos cargados previamente)  

---

## Notas Importantes

- **Búsqueda local:** Solo busca en Pokémon cargados en la BD
- **Paginación:** `page` comienza en 1, `offset` comienza en 0
- **Límite por defecto:** 10 resultados
- **Índices:** Optimizados para búsquedas rápidas
- **Orden:** Resultados ordenados por `pokedexNumber` (Pokémon) o alfabéticamente

---

## Ejemplos Completos

### Ejemplo 1: Buscar Pokémon y obtener sus movimientos

```graphql
query {
  searchPokemons(query: "char", limit: 5, offset: 0) {
    name
    types { name }
    moves {
      name
      power
      type { name }
    }
  }
}
```

### Ejemplo 2: Buscar movimiento y ver qué Pokémon lo aprenden

```graphql
query {
  searchMoves(query: "thunder", page: 1, limit: 5) {
    name
    power
    accuracy
    pokemons {
      name
      types { name }
    }
  }
}
```

### Ejemplo 3: Buscar tipo y ver Pokémon

```graphql
query {
  searchTypes(query: "water", page: 1, limit: 10) {
    name
    pokemons {
      name
      abilities { name }
    }
  }
}
```

### Ejemplo 4: Buscar habilidad

```graphql
query {
  searchAbilities(query: "static", page: 1, limit: 10) {
    name
    pokemons {
      name
      types { name }
    }
  }
}
```
