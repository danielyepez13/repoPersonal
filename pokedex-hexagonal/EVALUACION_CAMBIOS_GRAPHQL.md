# Evaluación de Cambios: Migración de PokeAPI a Backend GraphQL

## 📋 Resumen Ejecutivo
Migración de una fuente de datos REST (PokeAPI) a un backend GraphQL local en TypeScript.
- **URL actual**: `https://pokeapi.co/api/v2`
- **URL nueva**: `http://localhost:3000/graphql`
- **Impacto**: Cambios localizados en la capa de infraestructura

---

## 🔍 Análisis de Componentes Afectados

### 1. **Configuración Global** (`src/config.ts`)
**Estado actual:**
```
POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2'
```

**Cambio requerido:**
- Agregar nueva constante para GraphQL Backend
- Mantener la anterior para compatibilidad (si es necesario)

**Impacto**: ⚠️ BAJO - Solo configuración

---

### 2. **Cliente de API** (`src/infrastructure/pokeapi/PokeApiClient.ts`)
**Estado actual:**
- Usa `axios` para hacer peticiones REST
- Métodos: `getPokemonById()`, `getPokemonByName()`
- Estructura de respuesta: REST JSON de PokeAPI

**Cambios requeridos:**
- Reemplazar `axios` con cliente GraphQL (ej: `graphql-request`, `apollo-client`, o `urql`)
- Cambiar métodos para ejecutar queries GraphQL
- Adaptar la estructura de respuesta

**Impacto**: ⚠️ MEDIO - Cambio de protocolo (REST → GraphQL)

---

### 3. **Repositorio** (`src/infrastructure/pokeapi/PokeApiPokemonRepository.ts`)
**Estado actual:**
- Implementa `PokemonRepository` interface
- Mapea respuesta de PokeAPI al dominio
- Manejo de errores específico para PokeAPI (404)

**Cambios requeridos:**
- Actualizar la función `mapToDomain()` para adaptarse a la estructura GraphQL
- Revisar manejo de errores (GraphQL devuelve errores diferente)
- Posible renombrado de la clase (ej: `GraphQLPokemonRepository`)

**Impacto**: ⚠️ MEDIO - Mapeo de datos y manejo de errores

---

## 📊 Comparativa: Estructura de Respuestas

### PokeAPI REST (Actual)
```json
{
  "id": 1,
  "name": "bulbasaur",
  "height": 7,
  "weight": 69,
  "types": [
    { "type": { "name": "grass" } },
    { "type": { "name": "poison" } }
  ],
  "abilities": [
    { "ability": { "name": "overgrow" }, "is_hidden": false }
  ],
  "stats": [
    { "base_stat": 45 },
    { "base_stat": 49 }
  ]
}
```

### Backend GraphQL (Nuevo)
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
        "spriteUrl": "...",
        "types": [
          { "id": 12, "name": "grass", "slot": 1 }
        ],
        "abilities": [
          { "id": 65, "name": "overgrow", "slot": 1, "isHidden": false }
        ],
        "stats": [
          { "id": 1, "name": "hp", "baseStat": 45, "effort": 0 }
        ]
      }
    ]
  }
}
```

**Diferencias clave:**
- ✅ Estructura más plana y normalizada
- ✅ Nombres de campos en camelCase (GraphQL)
- ✅ Incluye `pokedexNumber` y `spriteUrl`
- ✅ Estadísticas con estructura diferente (array de objetos con `name` y `baseStat`)
- ✅ Respuesta envuelta en `{ data: { pokemons: [...] } }`

---

## 🛠️ Cambios Específicos Requeridos

### Archivo 1: `src/config.ts`
```diff
+ export const GRAPHQL_BACKEND_URL = 'http://localhost:3000/graphql';
```

### Archivo 2: `src/infrastructure/pokeapi/PokeApiClient.ts`
**Cambios:**
- Reemplazar `axios` con cliente GraphQL
- Cambiar método `getPokemonById()` para ejecutar query GraphQL
- Cambiar método `getPokemonByName()` para ejecutar query GraphQL
- Actualizar manejo de respuestas

**Ejemplo de query GraphQL a usar:**
```graphql
query GetPokemonById($id: Int!) {
  pokemons(page: 1, limit: 1) {
    id
    pokedexNumber
    name
    height
    weight
    spriteUrl
    types { id name slot }
    abilities { id name slot isHidden }
    stats { id name baseStat effort }
    moves { name power pp priority accuracy type { name } }
  }
}
```

### Archivo 3: `src/infrastructure/pokeapi/PokeApiPokemonRepository.ts`
**Cambios en `mapToDomain()`:**
- Adaptar acceso a campos (ej: `data.types[0].type.name` → `data.types[0].name`)
- Adaptar estadísticas (estructura diferente)
- Manejar `pokedexNumber` si es necesario
- Actualizar manejo de errores GraphQL

---

## 📈 Impacto en Otras Capas

### ✅ NO afectado
- **Domain Layer** (`src/domain/pokemon/`) - Interfaces y entidades permanecen igual
- **Application Layer** (`src/application/queries/`) - Queries permanecen igual
- **Routes/UI** (`src/routes/`) - No requieren cambios

### ⚠️ Potencialmente afectado
- **Validaciones** - Si hay validaciones específicas de PokeAPI (ej: `MAX_POKEMON_ID`)
- **Tests** - Si existen tests que mockean PokeAPI

---

## 🚀 Plan de Implementación

### Fase 1: Preparación
- [x] Instalar cliente GraphQL (`graphql-request` recomendado por su simplicidad)
- [x] Crear nueva clase `GraphQLClient` o actualizar `PokeApiClient`
- [x] Agregar URL en `config.ts`

### Fase 2: Implementación
- [x] Actualizar `PokeApiClient.ts` con queries GraphQL
- [x] Actualizar `mapToDomain()` en `PokeApiPokemonRepository.ts`
- [x] Actualizar manejo de errores

### Fase 3: Validación
- [ ] Probar queries individuales
- [ ] Verificar mapeo de datos
- [ ] Validar manejo de errores
- [ ] Pruebas de integración

---

## 📦 Dependencias Necesarias

**Opción 1: graphql-request (Recomendado - Ligero)**
```json
{
  "graphql-request": "^6.x.x",
  "graphql": "^16.x.x"
}
```

**Opción 2: Apollo Client (Más robusto)**
```json
{
  "@apollo/client": "^3.x.x",
  "graphql": "^16.x.x"
}
```

**Opción 3: URQL (Balance)**
```json
{
  "urql": "^4.x.x",
  "graphql": "^16.x.x"
}
```

---

## ⚠️ Consideraciones Importantes

1. **Paginación**: El backend GraphQL usa `page` y `limit`, similar a PokeAPI
2. **Búsqueda por ID**: Necesitarás filtrar en el cliente o ajustar la query
3. **Búsqueda por nombre**: Similar a ID, requiere filtrado
4. **Manejo de errores**: GraphQL devuelve errores en estructura diferente
5. **Disponibilidad del backend**: Asegurar que el backend esté corriendo en `localhost:3000`

---

## 📝 Notas Finales

- El cambio es **localizado** a la capa de infraestructura
- La arquitectura hexagonal permite este cambio sin afectar el dominio
- Los cambios son **reversibles** si es necesario
- Se recomienda mantener tests durante la migración
