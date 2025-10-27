import { Module } from '@nestjs/common';
import { PokemonResolver } from './interfaces/graphql/pokemon.resolver';
import { GetPokemonsHandler } from './application/pokemon/handlers/get-pokemons.handler';
import { PrismaPokemonRepository } from './infrastructure/prisma/repositories/prisma-pokemon.repository';
import { PokeApiService } from './infrastructure/pokeapi/pokeapi.service';
import { PrismaModule } from './infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    PokemonResolver,
    GetPokemonsHandler,
    PrismaPokemonRepository,
    PokeApiService,
    {
      provide: 'PokemonRepository',
      useClass: PrismaPokemonRepository,
    },
  ],
})
export class PokemonModule {}
