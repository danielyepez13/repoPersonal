import type { PokemonLoader } from '../loaders/pokemon.loader';

/**
 * Contexto de GraphQL que contiene los DataLoaders disponibles durante la ejecución de queries.
 * Se crea una nueva instancia por cada request para evitar compartir cache entre usuarios.
 */
export interface GraphQLContext {
  pokemonLoader: PokemonLoader;
}
