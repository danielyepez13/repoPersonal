# Pokedex - Arquitectura Hexagonal

## Descripción
Sistema modular de Pokedex implementando:
- Backend en NestJS con GraphQL
- Frontend en Svelte con arquitectura hexagonal
- Integración con PokeAPI

## Estructura del Proyecto

### pokedex-backend
- **Stack**: NestJS, Prisma, GraphQL
- **Funcionalidades**:
  - API GraphQL para consultas de Pokémon
  - Repositorios: Prisma (DB local) y PokeAPI (externo)
  - Módulo de Pokémon configurable

### pokedex-hexagonal  
- **Stack**: Svelte, TypeScript
- **Patrón**: Arquitectura hexagonal
- **Componentes clave**:
  - Dominio Pokémon (entidades y VOs)
  - Cliente PokeAPI
  - Mapeo de datos externos a dominio

## Diagrama de Arquitectura
(Insertar diagrama aquí mostrando la interacción entre componentes)

## Configuración
1. Clonar ambos repositorios
2. Instalar dependencias:
   ```bash
   # Backend
   cd pokedex-backend
   pnpm install

   # Frontend
   cd ../pokedex-hexagonal
   pnpm install