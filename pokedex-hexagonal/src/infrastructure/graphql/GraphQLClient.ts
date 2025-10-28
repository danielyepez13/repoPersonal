import { GraphQLClient, gql } from "graphql-request";
import { GRAPHQL_BACKEND_URL } from "$config";

export class GraphQLPokemonClient {
  private client: GraphQLClient;

  constructor() {
    this.client = new GraphQLClient(GRAPHQL_BACKEND_URL);
  }

  /**
   * Obtiene lista de pokémon con información básica (sin estadísticas ni movimientos)
   * Optimizado para listados
   */
  async getPokemons(page: number = 1, limit: number = 10): Promise<any> {
    const query = gql`
      query GetPokemons($page: Int!, $limit: Int!) {
        pokemons(page: $page, limit: $limit) {
          id
          pokedexNumber
          name
          height
          weight
          spriteUrl
          types {
            id
            name
            slot
          }
          abilities {
            id
            name
            slot
            isHidden
          }
        }
      }
    `;

    const response = await this.client.request(query, {
      page,
      limit,
    });

    return response.pokemons;
  }

  /**
   * Obtiene un pokémon específico por ID (pokedexNumber) SIN movimientos
   * Optimizado para carga inicial rápida
   * Usa query pokemonById(id: Int!) donde id es el pokedexNumber
   */
  async getPokemonById(id: number): Promise<any> {
    const query = gql`
      query GetPokemonById($id: Int!) {
        pokemonById(id: $id) {
          id
          pokedexNumber
          name
          height
          weight
          spriteUrl
          createdAt
          types {
            id
            name
            slot
          }
          abilities {
            id
            name
            slot
            isHidden
          }
          stats {
            id
            name
            baseStat
            effort
          }
        }
      }
    `;

    const response = await this.client.request(query, {
      id,
    });

    if (!response.pokemonById) {
      throw new Error(`Pokemon with id ${id} not found`);
    }

    return response.pokemonById;
  }

  /**
   * Obtiene los movimientos de un pokémon específico por ID (pokedexNumber)
   * Método separado para lazy loading
   * Usa query pokemonById(id: Int!) donde id es el pokedexNumber
   * Incluye pokeApiId para lazy loading de detalles del movimiento
   */
  async getPokemonMoves(id: number): Promise<any[]> {
    const query = gql`
      query GetPokemonMoves($id: Int!) {
        pokemonById(id: $id) {
          moves {
            id
            pokeApiId
            name
            power
            pp
            priority
            accuracy
            type {
              id
              name
            }
            levelLearnedAt
            moveLearnMethod
          }
        }
      }
    `;

    const response = await this.client.request(query, {
      id,
    });

    if (!response.pokemonById) {
      throw new Error(`Pokemon with id ${id} not found`);
    }

    return response.pokemonById.moves || [];
  }

  /**
   * Obtiene detalles de un movimiento específico por ID
   * Incluye pokémon relacionados para lazy loading
   * Usa query moveById(id: Int!) donde id es el pokeApiId
   */
  async getMoveById(id: number): Promise<any> {
    const query = gql`
      query GetMoveById($id: Int!) {
        moveById(id: $id) {
          id
          pokeApiId
          name
          power
          pp
          priority
          accuracy
          type {
            id
            name
          }
        }
      }
    `;

    const response = await this.client.request(query, {
      id,
    });

    if (!response.moveById) {
      throw new Error(`Move with id ${id} not found`);
    }

    return response.moveById;
  }

  /**
   * Obtiene los pokémon que aprenden un movimiento específico
   * Método separado para lazy loading de pokémon relacionados
   * Usa query moveById(id: Int!) donde id es el pokeApiId
   */
  async getMovePokemon(id: number): Promise<any[]> {
    const query = gql`
      query GetMovePokemon($id: Int!) {
        moveById(id: $id) {
          pokemons {
            id
            pokedexNumber
            name
            height
            weight
            spriteUrl
            createdAt
          }
        }
      }
    `;

    const response = await this.client.request(query, {
      id,
    });

    if (!response.moveById) {
      throw new Error(`Move with id ${id} not found`);
    }

    return response.moveById.pokemons || [];
  }

  /**
   * Obtiene un pokémon específico por nombre con todos los detalles
   * Incluye estadísticas y movimientos
   */
  async getPokemonByName(name: string): Promise<any> {
    const query = gql`
      query GetPokemonByName($name: String!) {
        pokemon(name: $name) {
          id
          pokedexNumber
          name
          height
          weight
          spriteUrl
          createdAt
          types {
            id
            name
            slot
          }
          abilities {
            id
            name
            slot
            isHidden
          }
          stats {
            id
            name
            baseStat
            effort
          }
          moves {
            name
            power
            pp
            priority
            accuracy
            type {
              name
            }
            levelLearnedAt
            moveLearnMethod
          }
        }
      }
    `;

    const response = await this.client.request(query, {
      name,
    });

    if (!response.pokemon) {
      throw new Error(`Pokemon with name ${name} not found`);
    }

    return response.pokemon;
  }
}
