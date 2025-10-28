import { Pokemon } from '$domain/pokemon/entities/Pokemon';
import { PokemonId } from '$domain/pokemon/value-objects/PokemonId';
import { PokemonName } from '$domain/pokemon/value-objects/PokemonName';
import type { PokemonRepository } from '$domain/pokemon/repositories/PokemonRepository';
import { GraphQLPokemonClient } from './GraphQLClient';

export class GraphQLPokemonRepository implements PokemonRepository {
    constructor(private readonly client: GraphQLPokemonClient = new GraphQLPokemonClient()) { }

    async findById(id: PokemonId): Promise<Pokemon | null> {
        try {
            const data = await this.client.getPokemonById(id.getValue());
            return this.mapToDomain(data);
        } catch (error) {
            if (error instanceof Error && error.message.includes('not found')) {
                return null;
            }
            throw error;
        }
    }

    async findByName(name: PokemonName): Promise<Pokemon | null> {
        try {
            const data = await this.client.getPokemonByName(name.getValue());
            return this.mapToDomain(data);
        } catch (error) {
            if (error instanceof Error && error.message.includes('not found')) {
                return null;
            }
            throw error;
        }
    }

    private mapToDomain(data: any): Pokemon {
        return Pokemon.createFromPrimitives({
            id: data.id,
            name: data.name,
            types: data.types.map((t: any) => t.name),
            abilities: data.abilities.map((a: any) => ({
                name: a.name,
                isHidden: a.isHidden
            })),
            stats: {
                hp: data.stats.find((s: any) => s.name === 'hp')?.baseStat || 0,
                attack: data.stats.find((s: any) => s.name === 'attack')?.baseStat || 0,
                defense: data.stats.find((s: any) => s.name === 'defense')?.baseStat || 0,
                specialAttack: data.stats.find((s: any) => s.name === 'special-attack')?.baseStat || 0,
                specialDefense: data.stats.find((s: any) => s.name === 'special-defense')?.baseStat || 0,
                speed: data.stats.find((s: any) => s.name === 'speed')?.baseStat || 0
            },
            height: data.height,
            weight: data.weight
        });
    }
}
