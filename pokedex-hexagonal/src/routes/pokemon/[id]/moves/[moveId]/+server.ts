import { json, type RequestHandler } from '@sveltejs/kit';
import { GraphQLPokemonClient } from '$infrastructure/graphql/GraphQLClient';

const graphqlClient = new GraphQLPokemonClient();

/**
 * GET /pokemon/[id]/moves/[moveId]
 * Obtiene los detalles de un movimiento específico
 * Retorna: id, name, power, pp, priority, accuracy, type
 */
export const GET: RequestHandler = async ({ params, fetch: svelteKitFetch }) => {
  try {
    const moveId = parseInt(params.moveId, 10);

    if (isNaN(moveId)) {
      return json(
        { error: 'Invalid move ID' },
        { status: 400 }
      );
    }

    const move = await graphqlClient.getMoveById(moveId);

    return json(move);
  } catch (error) {
    console.error('Error fetching move details:', error);
    return json(
      { error: 'Failed to fetch move details' },
      { status: 500 }
    );
  }
};
