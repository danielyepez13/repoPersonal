import { Module } from '@nestjs/common';
import { PokemonResolver } from './interfaces/graphql/pokemon.resolver';
import { GetPokemonsHandler } from './application/pokemon/handlers/get-pokemons.handler';
import { GetPokemonByNameHandler } from './application/pokemon/handlers/get-pokemon-by-name.handler';
import { SearchPokemonsHandler } from './application/pokemon/handlers/search-pokemons.handler';
import { SearchMovesHandler } from './application/pokemon/handlers/search-moves.handler';
import { SearchTypesHandler } from './application/pokemon/handlers/search-types.handler';
import { SearchAbilitiesHandler } from './application/pokemon/handlers/search-abilities.handler';
import { PrismaPokemonRepository } from './infrastructure/prisma/repositories/prisma-pokemon.repository';
import { PokeApiService } from './infrastructure/pokeapi/pokeapi.service';
import { PrismaModule } from './infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    PokemonResolver,
    GetPokemonsHandler,
    GetPokemonByNameHandler,
    SearchPokemonsHandler,
    SearchMovesHandler,
    SearchTypesHandler,
    SearchAbilitiesHandler,
    PrismaPokemonRepository,
    PokeApiService,
    {
      provide: 'PokemonRepository',
      useClass: PrismaPokemonRepository,
    },
  ],
})
export class PokemonModule {}
