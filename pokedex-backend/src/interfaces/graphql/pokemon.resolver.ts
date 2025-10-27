import { Query, Resolver, Args } from '@nestjs/graphql';
import { GetPokemonsQuery } from '@/application/pokemon/queries/get-pokemons.query';
import { GetPokemonsHandler } from '@/application/pokemon/handlers/get-pokemons.handler';
import { GetPokemonByNameQuery } from '@/application/pokemon/queries/get-pokemon-by-name.query';
import { GetPokemonByNameHandler } from '@/application/pokemon/handlers/get-pokemon-by-name.handler';
import { SearchPokemonsQuery } from '@/application/pokemon/queries/search-pokemons.query';
import { SearchPokemonsHandler } from '@/application/pokemon/handlers/search-pokemons.handler';
import { SearchMovesQuery } from '@/application/pokemon/queries/search-moves.query';
import { SearchMovesHandler } from '@/application/pokemon/handlers/search-moves.handler';
import { SearchTypesQuery } from '@/application/pokemon/queries/search-types.query';
import { SearchTypesHandler } from '@/application/pokemon/handlers/search-types.handler';
import { SearchAbilitiesQuery } from '@/application/pokemon/queries/search-abilities.query';
import { SearchAbilitiesHandler } from '@/application/pokemon/handlers/search-abilities.handler';
import { Pokemon } from '@/domain/pokemon/entities/pokemon.entity';
import { MoveWithPokemons } from '@/domain/pokemon/entities/move-with-pokemons.entity';
import { TypeWithPokemons } from '@/domain/pokemon/entities/type-with-pokemons.entity';
import { AbilityWithPokemons } from '@/domain/pokemon/entities/ability-with-pokemons.entity';

@Resolver('Pokemon')
export class PokemonResolver {
  constructor(
    private readonly pokemonsHandler: GetPokemonsHandler,
    private readonly pokemonByNameHandler: GetPokemonByNameHandler,
    private readonly searchPokemonsHandler: SearchPokemonsHandler,
    private readonly searchMovesHandler: SearchMovesHandler,
    private readonly searchTypesHandler: SearchTypesHandler,
    private readonly searchAbilitiesHandler: SearchAbilitiesHandler,
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

  @Query(() => [MoveWithPokemons])
  async searchMoves(@Args() input: SearchMovesQuery) {
    return this.searchMovesHandler.execute(input);
  }

  @Query(() => [TypeWithPokemons])
  async searchTypes(@Args() input: SearchTypesQuery) {
    return this.searchTypesHandler.execute(input);
  }

  @Query(() => [AbilityWithPokemons])
  async searchAbilities(@Args() input: SearchAbilitiesQuery) {
    return this.searchAbilitiesHandler.execute(input);
  }
}
