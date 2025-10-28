import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { GraphQLPokemonClient } from '$infrastructure/graphql/GraphQLClient';

/**
 * Endpoint para obtener los movimientos de un pokémon
 * GET /pokemon/[id]/moves
 */
export const GET: RequestHandler = async ({ params }) => {
    try {
        const pokedexNumber = Number(params.id);
        
        if (!Number.isInteger(pokedexNumber) || pokedexNumber <= 0) {
            return json(
                { error: 'ID de Pokémon inválido' },
                { status: 400 }
            );
        }

        const client = new GraphQLPokemonClient();
        const moves = await client.getPokemonMoves(pokedexNumber);

        return json({ moves });
    } catch (error) {
        console.error('Error loading pokemon moves:', error);
        return json(
            { error: 'Error al cargar los movimientos del Pokémon' },
            { status: 500 }
        );
    }
};
