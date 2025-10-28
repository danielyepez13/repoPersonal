# Pokedex Backend API

API REST para gestionar información de Pokémon usando **Arquitectura Hexagonal**, **NestJS**, **GraphQL**, **Prisma** y **PostgreSQL**.

## 📋 Descripción General

Este proyecto implementa una API GraphQL para consultar y gestionar datos de Pokémon. La arquitectura sigue el patrón hexagonal (puertos y adaptadores) para garantizar separación de responsabilidades, testabilidad y mantenibilidad del código.

**Características principales:**
- ✅ Búsqueda de Pokémon por ID, nombre y coincidencia parcial
- ✅ Integración con PokeAPI para obtener datos completos
- ✅ Caché automático en base de datos
- ✅ GraphQL con tipos fuertemente tipados
- ✅ Arquitectura hexagonal con inyección de dependencias
- ✅ Manejo de race conditions en operaciones concurrentes
- ✅ Índices de base de datos para búsquedas optimizadas

---

## 🏗️ Arquitectura Hexagonal

La arquitectura hexagonal divide el proyecto en capas independientes con responsabilidades claras:

```
src/
├── domain/                    # 🎯 NÚCLEO DEL NEGOCIO (Independiente)
├── application/               # 📋 CASOS DE USO (Lógica de aplicación)
├── infrastructure/            # 🔌 ADAPTADORES (Implementaciones técnicas)
└── interfaces/                # 🌐 PUERTOS DE ENTRADA (Controladores)
```

### 📂 Estructura de Directorios

#### **1. Domain** - Núcleo del Negocio
```
src/domain/pokemon/
├── entities/                  # Modelos de dominio
│   ├── pokemon.entity.ts      # Entidad principal de Pokémon
│   ├── pokemon-type.entity.ts # Relación Pokémon-Tipo
│   ├── pokemon-ability.entity.ts # Relación Pokémon-Habilidad
│   └── pokemon-stat.entity.ts # Relación Pokémon-Estadística
└── repositories/
    └── pokemon.repository.ts  # Interfaz del repositorio (PUERTO)
```

**Objetivo:** Define las reglas de negocio y contratos que el resto del sistema debe cumplir. **Independiente de frameworks y bases de datos.**

**Archivos clave:**
- `pokemon.entity.ts` - Define la estructura de un Pokémon con sus relaciones
- `pokemon.repository.ts` - Contrato que cualquier repositorio debe implementar

---

#### **2. Application** - Casos de Uso
```
src/application/pokemon/
├── queries/                   # DTOs de entrada para queries
│   ├── get-pokemons.query.ts
│   ├── get-pokemon-by-name.query.ts
│   └── search-pokemons.query.ts
└── handlers/                  # Lógica de casos de uso
    ├── get-pokemons.handler.ts
    ├── get-pokemon-by-name.handler.ts
    └── search-pokemons.handler.ts
```

**Objetivo:** Implementa los casos de uso de la aplicación. Orquesta la lógica entre el dominio y la infraestructura.

**Archivos clave:**
- `get-pokemons.handler.ts` - Obtiene lista paginada de Pokémon
  - Busca en BD primero
  - Identifica Pokémon con relaciones incompletas
  - Busca en PokeAPI y actualiza BD si es necesario
  
- `get-pokemon-by-name.handler.ts` - Busca Pokémon por nombre exacto
  - Búsqueda case-insensitive en BD
  - Fallback a PokeAPI si no existe
  
- `search-pokemons.handler.ts` - Búsqueda por coincidencia parcial
  - Solo busca en BD (no en PokeAPI)
  - Soporta paginación

---

#### **3. Infrastructure** - Adaptadores Técnicos
```
src/infrastructure/
├── prisma/
│   ├── repositories/
│   │   └── prisma-pokemon.repository.ts  # Implementación del repositorio
│   ├── mappers/
│   │   └── pokemon.mapper.ts             # Transformación Prisma → Dominio
│   ├── prisma.service.ts                 # Cliente de Prisma
│   └── prisma.module.ts                  # Módulo de Prisma
├── pokeapi/
│   └── pokeapi.service.ts                # Cliente de PokeAPI (ADAPTADOR)
└── prisma/
    └── schema.prisma                     # Definición de BD
```

**Objetivo:** Implementa los detalles técnicos (BD, APIs externas, etc.). Fácil de cambiar sin afectar el dominio.

**Archivos clave:**
- `prisma-pokemon.repository.ts` - Implementa el contrato del repositorio
  - `findById()` - Obtiene Pokémon por ID con todas sus relaciones
  - `findManyByIds()` - Obtiene múltiples Pokémon
  - `findByName()` - Búsqueda exacta por nombre
  - `searchByName()` - Búsqueda por coincidencia parcial
  - `save()` - Guarda/actualiza Pokémon y sus relaciones
  - `getPokemonInclude()` - Helper para reutilizar estructura de include de Prisma
  
- `pokemon.mapper.ts` - Transforma datos de Prisma a entidades de dominio
  - `toDomain()` - Convierte un Pokémon de Prisma a dominio
  - `toDomainArray()` - Convierte múltiples Pokémon
  - `validateAndCast()` - Valida datos de forma segura
  - Mapeos privados para tipos, habilidades y estadísticas
  
- `pokeapi.service.ts` - Cliente para consumir PokeAPI
  - `fetchPokemon(id)` - Obtiene Pokémon por ID
  - `fetchPokemonByName(name)` - Obtiene Pokémon por nombre
  - `fetchPokemonData()` - Lógica común de fetch
  - Mapeos privados para transformar datos de API

---

#### **4. Interfaces** - Puertos de Entrada
```
src/interfaces/graphql/
└── pokemon.resolver.ts        # Resolvedor de GraphQL
```

**Objetivo:** Define los puntos de entrada a la aplicación (GraphQL, REST, etc.).

**Archivos clave:**
- `pokemon.resolver.ts` - Resolvedor GraphQL
  - `pokemons(page, limit)` - Query para obtener lista paginada
  - `pokemon(name)` - Query para obtener Pokémon por nombre
  - `searchPokemons(query, limit, offset)` - Query para búsqueda parcial

---

#### **5. Configuración y Módulos**
```
src/
├── pokemon.module.ts          # Módulo de Pokémon (inyección de dependencias)
├── app.module.ts              # Módulo raíz
└── main.ts                    # Punto de entrada
```

**Objetivo:** Configura la inyección de dependencias y registra módulos.

**Archivos clave:**
- `pokemon.module.ts` - Registra handlers, repositorio y servicios
  - Proporciona `PokemonRepository` usando `PrismaPokemonRepository`
  - Registra todos los handlers (GetPokemonsHandler, GetPokemonByNameHandler, etc.)

---

#### **6. Base de Datos**
```
prisma/
├── schema.prisma              # Definición de modelos y relaciones
└── migrations/                # Historial de cambios en BD
```

**Objetivo:** Define la estructura de la base de datos.

**Modelos principales:**
- `Pokemon` - Pokémon con índice en `name` para búsquedas rápidas
- `Type` - Tipos de Pokémon (fuego, agua, etc.)
- `Ability` - Habilidades de Pokémon
- `Stat` - Estadísticas de Pokémon
- `PokemonType`, `PokemonAbility`, `PokemonStat` - Relaciones many-to-many

---

## 🔄 Flujo de Datos (Ejemplo: Obtener Pokémon por nombre)

```
GraphQL Query (pokemon.resolver.ts)
    ↓
GetPokemonByNameHandler (application)
    ↓
PokemonRepository.findByName() (domain interface)
    ↓
PrismaPokemonRepository.findByName() (infrastructure)
    ↓
Prisma Query (BD)
    ↓
PokemonMapper.toDomain() (infrastructure)
    ↓
Pokemon Entity (domain)
    ↓
GraphQL Response
```

---

## 🎯 Beneficios de la Arquitectura Hexagonal

| Beneficio | Descripción |
|-----------|------------|
| **Independencia** | El dominio no depende de frameworks o BD |
| **Testabilidad** | Fácil crear mocks de repositorios |
| **Mantenibilidad** | Cambios en BD no afectan la lógica de negocio |
| **Escalabilidad** | Fácil agregar nuevos adaptadores (REST, gRPC, etc.) |
| **Flexibilidad** | Cambiar de Prisma a TypeORM sin tocar el dominio |

---

---

## 🚀 Queries GraphQL Disponibles

### 1. Obtener lista paginada de Pokémon
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

### 2. Obtener Pokémon por nombre exacto
```graphql
query {
  pokemon(name: "bulbasaur") {
    id
    pokedexNumber
    name
    types { name slot }
    abilities { name slot isHidden }
    stats { name baseStat }
  }
}
```

### 3. Buscar Pokémon por coincidencia parcial
```graphql
query {
  searchPokemons(query: "bu", limit: 10, offset: 0) {
    id
    pokedexNumber
    name
    types { name slot }
    abilities { name slot }
    stats { name baseStat }
  }
}
```

---

## 🛠️ Instalación y Configuración

### Project setup

```bash
$ pnpm install
```

### Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/pokedex?schema=public"
```

### Configurar Base de Datos
```bash
# Crear y aplicar migraciones
$ npx prisma migrate dev --name init

# Generar cliente de Prisma
$ npx prisma generate
```

## Ejecutar el Proyecto

```bash
# Desarrollo (con hot reload)
$ pnpm start:dev

# Producción
$ pnpm start:prod
```

La aplicación estará disponible en `http://localhost:3000`

GraphQL Playground: `http://localhost:3000/graphql`

---

## 📊 Optimizaciones Implementadas

### Performance
- ✅ **Índice en BD** - Búsquedas por nombre optimizadas con `@@index([name])`
- ✅ **Paginación** - Queries con `limit` y `offset` para resultados grandes
- ✅ **Caché en BD** - Pokémon se guardan automáticamente después de la primera búsqueda
- ✅ **Lazy Loading** - Solo se cargan relaciones cuando se solicitan

### Confiabilidad
- ✅ **Race Condition Handling** - Patrón find-create-catch para operaciones concurrentes
- ✅ **Validación de Datos** - Mapper valida datos antes de transformarlos
- ✅ **Type Safety** - TypeScript con tipos fuertemente tipados en todo el proyecto

### Mantenibilidad
- ✅ **Refactorización** - Eliminación de código duplicado (-231 líneas)
- ✅ **Mapper Pattern** - Centralización de transformaciones de datos
- ✅ **Métodos Helper** - Reutilización de lógica común
- ✅ **Zero ESLint Warnings** - Código limpio sin type casting inseguro

---

## 📚 Patrones de Diseño Utilizados

| Patrón | Ubicación | Descripción |
|--------|-----------|------------|
| **Hexagonal Architecture** | Todo el proyecto | Separación de capas independientes |
| **Repository Pattern** | `domain/repositories` | Abstracción del acceso a datos |
| **Mapper Pattern** | `infrastructure/mappers` | Transformación entre capas |
| **Dependency Injection** | `pokemon.module.ts` | Inyección de dependencias con NestJS |
| **Handler Pattern** | `application/handlers` | Casos de uso como clases independientes |
| **Query Object Pattern** | `application/queries` | DTOs para entrada de datos |

---

## 🔧 Stack Tecnológico

- **Framework:** NestJS 11
- **Lenguaje:** TypeScript 5.9
- **API:** GraphQL con @nestjs/graphql
- **ORM:** Prisma 6
- **Base de Datos:** PostgreSQL
- **Cliente HTTP:** Axios
- **Gestor de Paquetes:** pnpm

---

## 📚 Guías de Documentación

### Queries GraphQL Disponibles

- **[SEARCH_QUERIES.md](./docs/guias/SEARCH_QUERIES.md)** - Búsqueda de Pokémon, Movimientos, Tipos y Habilidades
  - `searchPokemons` - Buscar Pokémon por nombre
  - `searchMoves` - Buscar movimientos
  - `searchTypes` - Buscar tipos
  - `searchAbilities` - Buscar habilidades

- **[TEAMS_GRAPHQL.md](./docs/guias/TEAMS_GRAPHQL.md)** - Sistema de Equipos de Pokémon
  - `createTeam` - Crear nuevo equipo
  - `team` - Obtener equipo por ID
  - `teams` - Listar equipos (paginado)
  - `updateTeam` - Actualizar equipo
  - `deleteTeam` - Eliminar equipo

### Arquitectura y Optimizaciones

- **[README.md](./README.md)** - Arquitectura hexagonal y estructura del proyecto
- **[REPOSITORY_OPTIMIZATION.md](./docs/REPOSITORY_OPTIMIZATION.md)** - Optimizaciones del repositorio

---

## 📝 Notas de Desarrollo

### Agregar una Nueva Funcionalidad

1. **Crear la entidad en Domain** (`src/domain/pokemon/entities/`)
2. **Definir el contrato en Domain** (`src/domain/pokemon/repositories/`)
3. **Crear el handler en Application** (`src/application/pokemon/handlers/`)
4. **Implementar en Infrastructure** (`src/infrastructure/prisma/repositories/`)
5. **Exponer en Interfaces** (`src/interfaces/graphql/pokemon.resolver.ts`)
6. **Registrar en Módulo** (`src/pokemon.module.ts`)

### Cambiar de Base de Datos

Solo necesitas:
1. Cambiar `prisma/schema.prisma` (datasource)
2. Crear nueva implementación de `PokemonRepository` en `infrastructure/`
3. Actualizar `pokemon.module.ts` para usar la nueva implementación

El resto del código permanece intacto gracias a la arquitectura hexagonal.

---

## 📄 Licencia

Este proyecto está bajo licencia MIT.
