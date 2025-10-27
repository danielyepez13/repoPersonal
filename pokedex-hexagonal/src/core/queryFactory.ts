import { GetPokemonByIdQuery } from '$application/queries/GetPokemonByIdQuery';
import { PokeApiPokemonRepository } from '$infrastructure/pokeapi/PokeApiPokemonRepository';

/**
 * Factory para crear instancias de queries.
 * Centraliza la creación de queries para facilitar el testing y la consistencia.
 */
export class QueryFactory {
    /**
     * Crea una instancia de GetPokemonByIdQuery.
     * @returns Instancia de GetPokemonByIdQuery
     */
    static createGetPokemonByIdQuery() {
        const repository = new PokeApiPokemonRepository();
        return new GetPokemonByIdQuery(repository);
    }
}
