import { Injectable, Inject } from '@nestjs/common';
import type { GraphQLContext } from '../context/graphql.context';
import type { PokemonRepository } from '@/domain/pokemon/repositories/pokemon.repository';
import { PokemonLoader } from '../loaders/pokemon.loader';

/**
 * Proveedor que crea el contexto de GraphQL para cada request.
 * Incluye los DataLoaders necesarios para optimizar las queries.
 */
@Injectable()
export class GraphQLContextProvider {
  constructor(
    @Inject('PokemonRepository')
    private readonly pokemonRepository: PokemonRepository,
  ) {}

  /**
   * Crea un nuevo contexto GraphQL con loaders frescos para cada request.
   * Esto evita compartir cache entre diferentes requests de usuarios.
   */
  createContext(): GraphQLContext {
    return {
      pokemonLoader: new PokemonLoader(this.pokemonRepository),
    };
  }
}
