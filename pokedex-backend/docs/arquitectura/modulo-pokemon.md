# Módulo Pokémon (pokemon.module.ts)

## Propósito
Módulo principal que organiza todos los componentes relacionados con Pokémon:
- Resolvers GraphQL
- Handlers de casos de uso
- Repositorios y servicios

## Estructura
```typescript
@Module({
  imports: [PrismaModule],  // Conexión a base de datos
  providers: [
    PokemonResolver,        // Capa GraphQL
    GetPokemonsHandler,     // Lógica de negocio
    PrismaPokemonRepository,// Acceso a datos
    PokeApiService,         // Integración externa
    {
      provide: 'PokemonRepository',  // Inyección de dependencias
      useClass: PrismaPokemonRepository
    }
  ]
})