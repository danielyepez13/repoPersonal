import type { PageLoad } from './$types';
import { GraphQLPokemonClient } from '$infrastructure/graphql/GraphQLClient';

/**
 * Cargador de datos para la página de inicio (listado de pokémon)
 * @returns Lista de pokémon con información básica
 */
export const load: PageLoad = async ({ url }) => {
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);

    try {
        const client = new GraphQLPokemonClient();
        const pokemons = await client.getPokemons(page, limit);

        return {
            pokemons: pokemons.map((pokemon: any) => ({
                id: pokemon.id,
                pokedexNumber: pokemon.pokedexNumber,
                name: pokemon.name,
                height: pokemon.height,
                weight: pokemon.weight,
                spriteUrl: pokemon.spriteUrl,
                types: pokemon.types.map((t: any) => ({
                    id: t.id,
                    name: t.name,
                    slot: t.slot
                })),
                abilities: pokemon.abilities.map((a: any) => ({
                    id: a.id,
                    name: a.name,
                    slot: a.slot,
                    isHidden: a.isHidden
                }))
            })),
            pagination: {
                page,
                limit,
                hasMore: pokemons.length === limit
            }
        };
    } catch (error) {
        console.error('Error loading pokemons:', error);
        throw error;
    }
};
