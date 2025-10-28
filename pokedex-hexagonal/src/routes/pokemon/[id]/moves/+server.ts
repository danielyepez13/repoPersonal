import { json, type RequestHandler } from '@sveltejs/kit';
import { GraphQLPokemonClient } from '$infrastructure/graphql/GraphQLClient';

const graphqlClient = new GraphQLPokemonClient();

/**
 * GET /pokemon/[id]/moves
 * Obtiene los movimientos de un pokémon específico
 * Lazy loading: solo se carga bajo demanda
 * Retorna: array de movimientos con id, name, power, pp, priority, accuracy, type
 */
export const GET: RequestHandler = async ({ params, fetch: svelteKitFetch }) => {
  try {
    const pokemonId = parseInt(params.id, 10);

    if (isNaN(pokemonId)) {
      return json(
        { error: 'Invalid pokemon ID' },
        { status: 400 }
      );
    }

    const moves = await graphqlClient.getPokemonMoves(pokemonId);

    return json({ moves });
  } catch (error) {
    console.error('Error fetching pokemon moves:', error);
    return json(
      { error: 'Failed to fetch pokemon moves' },
      { status: 500 }
    );
  }
};
