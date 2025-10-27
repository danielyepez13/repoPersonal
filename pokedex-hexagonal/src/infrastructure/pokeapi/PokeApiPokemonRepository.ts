import { Pokemon } from '$domain/pokemon/entities/Pokemon';
import { PokemonId } from '$domain/pokemon/value-objects/PokemonId';
import { PokemonName } from '$domain/pokemon/value-objects/PokemonName';
import type { PokemonRepository } from '$domain/pokemon/repositories/PokemonRepository';
import { PokeApiClient } from './PokeApiClient';
import axios from 'axios';

export class PokeApiPokemonRepository implements PokemonRepository {
    constructor(private readonly client: PokeApiClient = new PokeApiClient()) { }

    async findById(id: PokemonId): Promise<Pokemon | null> {
        try {
            const data = await this.client.getPokemonById(id.getValue());
            return this.mapToDomain(data);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
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
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return null;
            }
            throw error;
        }
    }

    private mapToDomain(data: any): Pokemon {
        return Pokemon.createFromPrimitives({
            id: data.id,
            name: data.name,
            types: data.types.map((t: any) => t.type.name),
            abilities: data.abilities.map((a: any) => ({
                name: a.ability.name,
                isHidden: a.is_hidden
            })),
            stats: {
                hp: data.stats[0].base_stat,
                attack: data.stats[1].base_stat,
                defense: data.stats[2].base_stat,
                specialAttack: data.stats[3].base_stat,
                specialDefense: data.stats[4].base_stat,
                speed: data.stats[5].base_stat
            },
            height: data.height,
            weight: data.weight
        });
    }
}
