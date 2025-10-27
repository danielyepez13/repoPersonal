import { Injectable, Inject } from '@nestjs/common';
import { GetPokemonsQuery } from '@/application/pokemon/queries/get-pokemons.query';
import type { Pokemon } from '@/domain/pokemon/entities/pokemon.entity';
import type { PokemonRepository } from '@/domain/pokemon/repositories/pokemon.repository';
import { PokeApiService } from '@/infrastructure/pokeapi/pokeapi.service';

@Injectable()
export class GetPokemonsHandler {
  constructor(
    @Inject('PokemonRepository')
    private readonly pokemonRepository: PokemonRepository,
    private readonly pokeApiService: PokeApiService,
  ) {}

  async execute(query: GetPokemonsQuery): Promise<Pokemon[]> {
    const startId = (query.page - 1) * (query.limit || 10) + 1;
    const ids = Array.from(
      { length: query.limit || 10 },
      (_, i) => startId + i,
    );

    // Buscar los pokémones que ya existen en la base de datos
    const existingPokemons = await this.pokemonRepository.findManyByIds(ids);
    const existingIds = existingPokemons.map((p) => p.pokedexNumber);
    const missingIds = ids.filter((id) => !existingIds.includes(id));

    // Buscar los que faltan en la PokeAPI y guardarlos
    const newPokemons = await Promise.all(
      missingIds.map(async (id) => {
        const apiPokemon = await this.pokeApiService.fetchPokemon(id);
        return this.pokemonRepository.save(apiPokemon);
      }),
    );

    // Combinar y ordenar resultados
    return [...existingPokemons, ...newPokemons].sort(
      (a, b) => a.pokedexNumber - b.pokedexNumber,
    );
  }
}
