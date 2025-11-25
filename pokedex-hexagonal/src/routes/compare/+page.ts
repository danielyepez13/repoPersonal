import type { PageLoad } from './$types';
import { GraphQLPokemonClient } from '$infrastructure/graphql/GraphQLClient';

const graphqlClient = new GraphQLPokemonClient();

export const load: PageLoad = async ({ url }) => {
  const pokemon1Name = url.searchParams.get('p1');
  const pokemon2Name = url.searchParams.get('p2');

  if (!pokemon1Name || !pokemon2Name) {
    return {
      pokemon1: null,
      pokemon2: null,
    };
  }

  try {
    const [pokemon1, pokemon2] = await Promise.all([
      graphqlClient.getPokemonByName(pokemon1Name),
      graphqlClient.getPokemonByName(pokemon2Name),
    ]);

    return {
      pokemon1,
      pokemon2,
    };
  } catch (error) {
    console.error('Error loading Pokémon:', error);
    return {
      pokemon1: null,
      pokemon2: null,
      error: 'No se encontraron uno o ambos Pokémon',
    };
  }
};
