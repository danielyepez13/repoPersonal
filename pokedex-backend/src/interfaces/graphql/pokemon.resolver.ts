import { Query, Resolver, Args } from '@nestjs/graphql';
import { GetPokemonsQuery } from '../../application/pokemon/queries/get-pokemons.query';
import { GetPokemonsHandler } from '../../application/pokemon/handlers/get-pokemons.handler';
import { Pokemon } from '../../domain/pokemon/entities/pokemon.entity';

@Resolver('Pokemon')
export class PokemonResolver {
  constructor(private readonly handler: GetPokemonsHandler) {}

  @Query(() => [Pokemon])
  async pokemons(@Args() input: GetPokemonsQuery) {
    return this.handler.execute(input);
  }
}
