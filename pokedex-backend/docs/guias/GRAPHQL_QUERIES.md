# GraphQL Queries - Pokédex Backend

## Query básico: Obtener Pokémon sin relaciones

```graphql
query {
  pokemons(page: 1, limit: 5) {
    id
    pokedexNumber
    name
    height
    weight
    spriteUrl
    createdAt
  }
}
```

**Respuesta esperada:**
```json
{
  "data": {
    "pokemons": [
      {
        "id": 1,
        "pokedexNumber": 1,
        "name": "bulbasaur",
        "height": 7,
        "weight": 69,
        "spriteUrl": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
        "createdAt": "2025-10-24T15:00:00Z"
      }
    ]
  }
}
```

---

## Query completo: Obtener Pokémon con tipos

```graphql
query {
  pokemons(page: 1, limit: 5) {
    id
    pokedexNumber
    name
    height
    weight
    spriteUrl
    types {
      id
      name
      slot
    }
  }
}
```

**Respuesta esperada:**
```json
{
  "data": {
    "pokemons": [
      {
        "id": 1,
        "pokedexNumber": 1,
        "name": "bulbasaur",
        "height": 7,
        "weight": 69,
        "spriteUrl": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
        "types": [
          {
            "id": 12,
            "name": "grass",
            "slot": 1
          },
          {
            "id": 4,
            "name": "poison",
            "slot": 2
          }
        ]
      }
    ]
  }
}
```

---

## Query completo: Obtener Pokémon con habilidades

```graphql
query {
  pokemons(page: 1, limit: 5) {
    id
    pokedexNumber
    name
    abilities {
      id
      name
      slot
      isHidden
    }
  }
}
```

**Respuesta esperada:**
```json
{
  "data": {
    "pokemons": [
      {
        "id": 1,
        "pokedexNumber": 1,
        "name": "bulbasaur",
        "abilities": [
          {
            "id": 65,
            "name": "overgrow",
            "slot": 1,
            "isHidden": false
          },
          {
            "id": 34,
            "name": "chlorophyll",
            "slot": 3,
            "isHidden": true
          }
        ]
      }
    ]
  }
}
```

---

## Query completo: Obtener Pokémon con estadísticas

```graphql
query {
  pokemons(page: 1, limit: 5) {
    id
    pokedexNumber
    name
    stats {
      id
      name
      baseStat
      effort
    }
  }
}
```

**Respuesta esperada:**
```json
{
  "data": {
    "pokemons": [
      {
        "id": 1,
        "pokedexNumber": 1,
        "name": "bulbasaur",
        "stats": [
          {
            "id": 1,
            "name": "hp",
            "baseStat": 45,
            "effort": 0
          },
          {
            "id": 2,
            "name": "attack",
            "baseStat": 49,
            "effort": 0
          },
          {
            "id": 3,
            "name": "defense",
            "baseStat": 49,
            "effort": 0
          },
          {
            "id": 4,
            "name": "special-attack",
            "baseStat": 65,
            "effort": 1
          },
          {
            "id": 5,
            "name": "special-defense",
            "baseStat": 65,
            "effort": 0
          },
          {
            "id": 6,
            "name": "speed",
            "baseStat": 45,
            "effort": 0
          }
        ]
      }
    ]
  }
}
```

---

## Query MEGA: Obtener Pokémon con TODAS las relaciones

```graphql
query {
  pokemons(page: 1, limit: 2) {
    id
    pokedexNumber
    name
    height
    weight
    spriteUrl
    createdAt
    types {
      id
      name
      slot
    }
    abilities {
      id
      name
      slot
      isHidden
    }
    stats {
      id
      name
      baseStat
      effort
    }
  }
}
```

**Respuesta esperada:**
```json
{
  "data": {
    "pokemons": [
      {
        "id": 1,
        "pokedexNumber": 1,
        "name": "bulbasaur",
        "height": 7,
        "weight": 69,
        "spriteUrl": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
        "createdAt": "2025-10-24T15:00:00Z",
        "types": [
          {
            "id": 12,
            "name": "grass",
            "slot": 1
          },
          {
            "id": 4,
            "name": "poison",
            "slot": 2
          }
        ],
        "abilities": [
          {
            "id": 65,
            "name": "overgrow",
            "slot": 1,
            "isHidden": false
          },
          {
            "id": 34,
            "name": "chlorophyll",
            "slot": 3,
            "isHidden": true
          }
        ],
        "stats": [
          {
            "id": 1,
            "name": "hp",
            "baseStat": 45,
            "effort": 0
          },
          {
            "id": 2,
            "name": "attack",
            "baseStat": 49,
            "effort": 0
          },
          {
            "id": 3,
            "name": "defense",
            "baseStat": 49,
            "effort": 0
          },
          {
            "id": 4,
            "name": "special-attack",
            "baseStat": 65,
            "effort": 1
          },
          {
            "id": 5,
            "name": "special-defense",
            "baseStat": 65,
            "effort": 0
          },
          {
            "id": 6,
            "name": "speed",
            "baseStat": 45,
            "effort": 0
          }
        ]
      },
      {
        "id": 2,
        "pokedexNumber": 2,
        "name": "ivysaur",
        "height": 10,
        "weight": 130,
        "spriteUrl": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png",
        "createdAt": "2025-10-24T15:00:00Z",
        "types": [
          {
            "id": 12,
            "name": "grass",
            "slot": 1
          },
          {
            "id": 4,
            "name": "poison",
            "slot": 2
          }
        ],
        "abilities": [
          {
            "id": 65,
            "name": "overgrow",
            "slot": 1,
            "isHidden": false
          },
          {
            "id": 34,
            "name": "chlorophyll",
            "slot": 3,
            "isHidden": true
          }
        ],
        "stats": [
          {
            "id": 1,
            "name": "hp",
            "baseStat": 60,
            "effort": 0
          },
          {
            "id": 2,
            "name": "attack",
            "baseStat": 62,
            "effort": 0
          },
          {
            "id": 3,
            "name": "defense",
            "baseStat": 63,
            "effort": 0
          },
          {
            "id": 4,
            "name": "special-attack",
            "baseStat": 80,
            "effort": 1
          },
          {
            "id": 5,
            "name": "special-defense",
            "baseStat": 80,
            "effort": 0
          },
          {
            "id": 6,
            "name": "speed",
            "baseStat": 60,
            "effort": 0
          }
        ]
      }
    ]
  }
}
```

---

## Parámetros disponibles

- **page** (requerido): Número de página (comienza en 1)
- **limit** (opcional, default: 10): Cantidad de Pokémon por página
- **offset** (opcional, default: 0): Desplazamiento adicional

### Ejemplo con parámetros personalizados:

```graphql
query {
  pokemons(page: 2, limit: 20, offset: 5) {
    id
    pokedexNumber
    name
  }
}
```

---

## Notas importantes

1. **Búsqueda automática en PokeAPI**: Si un Pokémon no existe en la BD, se busca automáticamente en la PokeAPI y se guarda con todas sus relaciones.

2. **Relaciones opcionales**: Los campos `types`, `abilities` y `stats` son opcionales. Puedes solicitar solo los que necesites.

3. **Campos anidados**: Cada relación tiene sus propios campos que puedes seleccionar.

4. **Ordenamiento**: Los resultados se devuelven ordenados por `pokedexNumber` de forma ascendente.
