# Equipos de Pokémon - Queries GraphQL

## Crear un Equipo

### Mutation: createTeam

```graphql
mutation {
  createTeam(input: {
    ownerId: 1
    name: "Mi Equipo Favorito"
    pokemons: [
      {
        pokemonId: 1
        slot: 1
        nickname: "Bulby"
        level: 50
        natureId: 1
        itemId: 1
      },
      {
        pokemonId: 4
        slot: 2
        nickname: "Charmander"
        level: 50
        natureId: 2
        itemId: 2
      },
      {
        pokemonId: 7
        slot: 3
        nickname: "Squirtle"
        level: 50
        natureId: 3
        itemId: 3
      }
    ]
  }) {
    id
    ownerId
    name
    createdAt
    pokemons {
      pokemonId
      slot
      nickname
      level
      natureId
      itemId
    }
  }
}
```

## Obtener un Equipo

### Query: team

```graphql
query {
  team(id: 1) {
    id
    ownerId
    name
    createdAt
    pokemons {
      pokemonId
      slot
      nickname
      level
      natureId
      itemId
    }
  }
}
```

## Validaciones

### Estructura del Equipo

- **Máximo 6 Pokémon** por equipo
- **Mínimo 1 Pokémon** por equipo
- **Slots únicos** (1-6)

### Requisitos de cada Pokémon

Cada Pokémon en el equipo debe cumplir:

1. **Habilidades:** Debe tener al menos 1 habilidad registrada
2. **Movimientos:** Debe tener al menos 4 movimientos registrados
3. **Naturaleza:** Debe tener 1 naturaleza asignada (requerida)
4. **Objeto:** Debe tener 1 objeto asignado (requerido)

### Mensajes de Error

```
# Equipo
BadRequestException: Un equipo puede tener máximo 6 Pokémon
BadRequestException: Un equipo debe tener al menos 1 Pokémon
BadRequestException: Los slots deben ser únicos
BadRequestException: Los slots deben estar entre 1 y 6

# Pokémon
BadRequestException: El Pokémon {name} no tiene habilidades registradas
BadRequestException: El Pokémon {name} no tiene movimientos registrados
BadRequestException: El Pokémon {name} debe tener al menos 4 movimientos (tiene {count})
BadRequestException: El Pokémon {name} debe tener una naturaleza asignada
BadRequestException: El Pokémon {name} debe tener un objeto asignado
```

## Flujo de Lazy Loading

Cuando creas o obtienes un equipo:

1. **Naturalezas:** Se cargan bajo demanda desde caché local → BD → PokeAPI
2. **Items:** Se cargan bajo demanda desde caché local → BD → PokeAPI
3. **Pokémon:** Se cargan con todas sus relaciones (tipos, habilidades, movimientos, estadísticas)

## Ejemplo Completo

### Paso 1: Crear Naturaleza (si no existe)

```graphql
# Las naturalezas se obtienen automáticamente de PokeAPI
# cuando especificas un natureId en el equipo
```

### Paso 2: Crear Item (si no existe)

```graphql
# Los items se obtienen automáticamente de PokeAPI
# cuando especificas un itemId en el equipo
```

### Paso 3: Crear Equipo

```graphql
mutation {
  createTeam(input: {
    ownerId: 1
    name: "Equipo Competitivo"
    pokemons: [
      {
        pokemonId: 25
        slot: 1
        nickname: "Pikachu"
        level: 100
        natureId: 1
        itemId: 1
      }
    ]
  }) {
    id
    name
    pokemons {
      pokemonId
      slot
      nickname
      level
    }
  }
}
```

### Paso 4: Obtener Equipo

```graphql
query {
  team(id: 1) {
    id
    name
    pokemons {
      pokemonId
      slot
      nickname
      level
    }
  }
}
```

## Listar Equipos

### Query: teams

```graphql
query {
  teams(page: 1, limit: 10) {
    id
    ownerId
    name
    createdAt
    pokemons {
      pokemonId
      slot
      nickname
      level
      natureId
      itemId
    }
  }
}
```

**Parámetros:**
- `page` (opcional, default: 1): Número de página
- `limit` (opcional, default: 10): Resultados por página

## Actualizar un Equipo

### Mutation: updateTeam

```graphql
mutation {
  updateTeam(input: {
    teamId: 1
    name: "Nuevo Nombre del Equipo"
    pokemons: [
      {
        pokemonId: 1
        slot: 1
        nickname: "Bulby Actualizado"
        level: 60
        natureId: 1
        itemId: 1
      }
    ]
  }) {
    id
    name
    pokemons {
      pokemonId
      slot
      nickname
      level
    }
  }
}
```

**Notas:**
- `teamId` es requerido
- `name` es opcional (solo actualiza si se proporciona)
- `pokemons` es opcional (solo actualiza si se proporciona)
- Si se actualizan Pokémon, se reemplazan todos los existentes

## Eliminar un Equipo

### Mutation: deleteTeam

```graphql
mutation {
  deleteTeam(id: 1)
}
```

**Respuesta:** `true` si se eliminó correctamente

## Resumen de Operaciones

| Operación | Tipo | Endpoint | Descripción |
|-----------|------|----------|-------------|
| Crear | Mutation | `createTeam` | Crea un nuevo equipo |
| Obtener | Query | `team` | Obtiene un equipo por ID |
| Listar | Query | `teams` | Lista todos los equipos (paginado) |
| Actualizar | Mutation | `updateTeam` | Actualiza nombre y/o Pokémon |
| Eliminar | Mutation | `deleteTeam` | Elimina un equipo |

## Notas

- **Naturalezas:** Se cachean en memoria durante la sesión
- **Items:** Se cachean en memoria durante la sesión
- **BD:** Todos los datos se guardan en la base de datos para futuras consultas
- **Validación:** El máximo de Pokémon por equipo es 6 (estándar de Pokémon)
- **Paginación:** Por defecto 10 resultados por página
- **Eliminación:** Al eliminar un equipo, se eliminan automáticamente todos sus Pokémon
