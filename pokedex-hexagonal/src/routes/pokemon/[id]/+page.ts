import type { PageLoad } from './$types';
import { QueryFactory } from '$core/queryFactory';

/**
 * Cargador de datos para la página de detalles de Pokémon.
 * @param params Parámetros de ruta
 * @returns Datos del Pokémon
 */
export const load: PageLoad = async ({ params }) => {
    const query = QueryFactory.createGetPokemonByIdQuery();

    try {
        const pokemon = await query.execute(Number(params.id));

        if (!pokemon) {
            throw new Error('Pokémon no encontrado');
        }

        return {
            pokemon: {
                id: pokemon.getId().getValue(),
                name: pokemon.getName().getValue(),
                types: pokemon.getTypes().map(type => type.getValue()),
                abilities: pokemon.getAbilities().map(ability => ({
                    name: ability.getName(),
                    isHidden: ability.getIsHidden()
                })),
                stats: pokemon.getStats().getProps(),
                height: pokemon.getHeight(),
                weight: pokemon.getWeight()
            }
        };
    } catch (error) {
        throw error;
    }
};
