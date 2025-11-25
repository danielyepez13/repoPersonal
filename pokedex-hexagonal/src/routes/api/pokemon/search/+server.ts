import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, fetch }) => {
  const query = url.searchParams.get('q') || '';
  const limit = url.searchParams.get('limit') || '5';

  if (query.length < 1) {
    return json([]);
  }

  try {
    const response = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query {
            searchPokemons(query: "${query}", limit: ${limit}, offset: 0) {
              id
              pokedexNumber
              name
              spriteUrl
              types { name }
            }
          }
        `
      })
    });

    const result = await response.json();
    
    if (result.errors) {
      console.error('GraphQL Error:', result.errors);
      return json([]);
    }

    return json(result.data?.searchPokemons || []);
  } catch (error) {
    console.error('Search error:', error);
    return json([]);
  }
};
