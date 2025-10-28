import type { PageLoad } from './$types';
import { GraphQLPokemonClient } from '$infrastructure/graphql/GraphQLClient';

/**
 * Cargador de datos para la página de detalles de Pokémon.
 * @param params Parámetros de ruta
 * @returns Datos del Pokémon con todos los detalles
 */
export const load: PageLoad = async ({ params }) => {
    try {
        const client = new GraphQLPokemonClient();
        const pokemonData = await client.getPokemonById(Number(params.id));

        if (!pokemonData) {
            throw new Error('Pokémon no encontrado');
        }

        return {
            pokemon: {
                id: pokemonData.id,
                pokedexNumber: pokemonData.pokedexNumber,
                name: pokemonData.name,
                spriteUrl: pokemonData.spriteUrl,
                height: pokemonData.height,
                weight: pokemonData.weight,
                types: pokemonData.types.map((t: any) => t.name),
                abilities: pokemonData.abilities.map((a: any) => ({
                    name: a.name,
                    isHidden: a.isHidden
                })),
                stats: {
                    hp: pokemonData.stats.find((s: any) => s.name === 'hp')?.baseStat || 0,
                    attack: pokemonData.stats.find((s: any) => s.name === 'attack')?.baseStat || 0,
                    defense: pokemonData.stats.find((s: any) => s.name === 'defense')?.baseStat || 0,
                    specialAttack: pokemonData.stats.find((s: any) => s.name === 'special-attack')?.baseStat || 0,
                    specialDefense: pokemonData.stats.find((s: any) => s.name === 'special-defense')?.baseStat || 0,
                    speed: pokemonData.stats.find((s: any) => s.name === 'speed')?.baseStat || 0
                }
            }
        };
    } catch (error) {
        console.error('Error loading pokemon:', error);
        throw error;
    }
};
