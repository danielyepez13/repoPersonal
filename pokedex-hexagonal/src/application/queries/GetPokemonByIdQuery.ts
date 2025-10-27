import { Pokemon } from '$domain/pokemon/entities/Pokemon';
import { PokemonId } from '$domain/pokemon/value-objects/PokemonId';
import type { PokemonRepository } from '$domain/pokemon/repositories/PokemonRepository';
import { DomainError } from '$lib/errors/DomainError';
import { MAX_POKEMON_ID } from '$config';

/**
 * Query para obtener un Pokémon por su ID.
 * Encapsula la lógica de recuperación de un Pokémon usando su ID.
 */
export class GetPokemonByIdQuery {
    /**
     * Crea una instancia de GetPokemonByIdQuery.
     * @param repository Repositorio de Pokémon
     */
    constructor(private readonly repository: PokemonRepository) { }

    /**
     * Ejecuta la query para obtener un Pokémon por ID.
     * @param id ID numérico del Pokémon
     * @returns Promise que resuelve al Pokémon encontrado o null si no existe
     */
    async execute(id: number): Promise<Pokemon | null> {
        if (!Number.isInteger(id) || id <= 0 || id > MAX_POKEMON_ID) {
            throw new DomainError('ID de Pokémon inválido', 'INVALID_POKEMON_ID');
        }
        const pokemonId = PokemonId.create(id);
        return this.repository.findById(pokemonId);
    }
}
