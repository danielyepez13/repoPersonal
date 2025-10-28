import { Module } from '@nestjs/common';
import { PokemonResolver } from './interfaces/graphql/pokemon.resolver';
import { TeamResolver } from './interfaces/graphql/team.resolver';
import { GetPokemonsHandler } from './application/pokemon/handlers/get-pokemons.handler';
import { GetPokemonByNameHandler } from './application/pokemon/handlers/get-pokemon-by-name.handler';
import { GetPokemonByIdHandler } from './application/pokemon/handlers/get-pokemon-by-id.handler';
import { GetMoveByIdHandler } from './application/pokemon/handlers/get-move-by-id.handler';
import { SearchPokemonsHandler } from './application/pokemon/handlers/search-pokemons.handler';
import { SearchMovesHandler } from './application/pokemon/handlers/search-moves.handler';
import { SearchTypesHandler } from './application/pokemon/handlers/search-types.handler';
import { SearchAbilitiesHandler } from './application/pokemon/handlers/search-abilities.handler';
import { CreateTeamHandler } from './application/pokemon/handlers/create-team.handler';
import { GetTeamHandler } from './application/pokemon/handlers/get-team.handler';
import { UpdateTeamHandler } from './application/pokemon/handlers/update-team.handler';
import { DeleteTeamHandler } from './application/pokemon/handlers/delete-team.handler';
import { ListTeamsHandler } from './application/pokemon/handlers/list-teams.handler';
import { PrismaPokemonRepository } from './infrastructure/prisma/repositories/prisma-pokemon.repository';
import { PokeApiService } from './infrastructure/pokeapi/pokeapi.service';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { GraphQLContextProvider } from './infrastructure/graphql/providers/graphql-context.provider';
import { PokemonLoader } from './infrastructure/graphql/loaders/pokemon.loader';
import { NatureCache } from './infrastructure/cache/nature.cache';
import { ItemCache } from './infrastructure/cache/item.cache';
import { PokeApiNatureItemService } from './infrastructure/pokeapi/pokeapi-nature-item.service';
import { NatureItemService } from './infrastructure/services/nature-item.service';

@Module({
  imports: [PrismaModule],
  providers: [
    PokemonResolver,
    TeamResolver,
    GetPokemonsHandler,
    GetPokemonByNameHandler,
    GetPokemonByIdHandler,
    GetMoveByIdHandler,
    SearchPokemonsHandler,
    SearchMovesHandler,
    SearchTypesHandler,
    SearchAbilitiesHandler,
    CreateTeamHandler,
    GetTeamHandler,
    UpdateTeamHandler,
    DeleteTeamHandler,
    ListTeamsHandler,
    PrismaPokemonRepository,
    PokeApiService,
    GraphQLContextProvider,
    PokemonLoader,
    NatureCache,
    ItemCache,
    PokeApiNatureItemService,
    NatureItemService,
    {
      provide: 'PokemonRepository',
      useClass: PrismaPokemonRepository,
    },
  ],
})
export class PokemonModule {}
