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

    // Separar pokémones existentes con relaciones incompletas
    const pokemonsWithIncompleteRelations = existingPokemons.filter(
      (p) =>
        !p.types ||
        p.types.length === 0 ||
        !p.abilities ||
        p.abilities.length === 0 ||
        !p.stats ||
        p.stats.length === 0,
    );
    const pokemonsWithCompleteRelations = existingPokemons.filter(
      (p) =>
        p.types &&
        p.types.length > 0 &&
        p.abilities &&
        p.abilities.length > 0 &&
        p.stats &&
        p.stats.length > 0,
    );

    // Buscar los que faltan en la PokeAPI y guardarlos
    const newPokemons = await Promise.all(
      missingIds.map(async (id) => {
        const apiPokemon = await this.pokeApiService.fetchPokemon(id);
        return this.pokemonRepository.save(apiPokemon);
      }),
    );

    // Actualizar pokémones con relaciones incompletas desde la PokeAPI
    const updatedPokemons = await Promise.all(
      pokemonsWithIncompleteRelations.map(async (p) => {
        const apiPokemon = await this.pokeApiService.fetchPokemon(
          p.pokedexNumber,
        );
        return this.pokemonRepository.save(apiPokemon);
      }),
    );

    // Combinar y ordenar resultados
    return [
      ...pokemonsWithCompleteRelations,
      ...newPokemons,
      ...updatedPokemons,
    ].sort((a, b) => a.pokedexNumber - b.pokedexNumber);
  }
}
