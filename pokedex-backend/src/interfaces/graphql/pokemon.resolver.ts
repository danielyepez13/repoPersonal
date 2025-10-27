import { Query, Resolver, Args } from '@nestjs/graphql';
import { GetPokemonsQuery } from '@/application/pokemon/queries/get-pokemons.query';
import { GetPokemonsHandler } from '@/application/pokemon/handlers/get-pokemons.handler';
import { GetPokemonByNameQuery } from '@/application/pokemon/queries/get-pokemon-by-name.query';
import { GetPokemonByNameHandler } from '@/application/pokemon/handlers/get-pokemon-by-name.handler';
import { SearchPokemonsQuery } from '@/application/pokemon/queries/search-pokemons.query';
import { SearchPokemonsHandler } from '@/application/pokemon/handlers/search-pokemons.handler';
import { Pokemon } from '@/domain/pokemon/entities/pokemon.entity';

@Resolver('Pokemon')
export class PokemonResolver {
  constructor(
    private readonly pokemonsHandler: GetPokemonsHandler,
    private readonly pokemonByNameHandler: GetPokemonByNameHandler,
    private readonly searchPokemonsHandler: SearchPokemonsHandler,
  ) {}

  @Query(() => [Pokemon])
  async pokemons(@Args() input: GetPokemonsQuery) {
    return this.pokemonsHandler.execute(input);
  }

  @Query(() => Pokemon, { nullable: true })
  async pokemon(@Args() input: GetPokemonByNameQuery) {
    return this.pokemonByNameHandler.execute(input);
  }

  @Query(() => [Pokemon])
  async searchPokemons(@Args() input: SearchPokemonsQuery) {
    return this.searchPokemonsHandler.execute(input);
  }
}
