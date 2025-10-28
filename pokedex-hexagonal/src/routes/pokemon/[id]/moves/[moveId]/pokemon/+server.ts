import { json, type RequestHandler } from '@sveltejs/kit';
import { GraphQLPokemonClient } from '$infrastructure/graphql/GraphQLClient';

const graphqlClient = new GraphQLPokemonClient();

/**
 * GET /pokemon/[id]/moves/[moveId]/pokemon
 * Obtiene los pokémon que aprenden un movimiento específico
 * Lazy loading: solo se carga bajo demanda
 * Retorna: array de pokémon con id, pokedexNumber, name, height, weight, spriteUrl, createdAt
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

    const pokemons = await graphqlClient.getMovePokemon(moveId);

    return json({ pokemons });
  } catch (error) {
    console.error('Error fetching move pokemon:', error);
    return json(
      { error: 'Failed to fetch move pokemon' },
      { status: 500 }
    );
  }
};
