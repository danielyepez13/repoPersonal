import type { PageLoad } from './$types';
import { GraphQLPokemonClient } from '$infrastructure/graphql/GraphQLClient';

const graphqlClient = new GraphQLPokemonClient();

export const load: PageLoad = async ({ params }) => {
  try {
    const moveId = parseInt(params.moveId, 10);
    const pokemonId = parseInt(params.id, 10);

    if (isNaN(moveId) || isNaN(pokemonId)) {
      throw new Error('Invalid move or pokemon ID');
    }

    const move = await graphqlClient.getMoveById(moveId);

    return {
      move,
      moveId,
      pokemonId,
    };
  } catch (error) {
    console.error('Error loading move details:', error);
    throw error;
  }
};
