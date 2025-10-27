import { PokemonId } from '$domain/pokemon/value-objects/PokemonId';
import { PokemonName } from '$domain/pokemon/value-objects/PokemonName';
import { PokemonStats } from '$domain/pokemon/value-objects/PokemonStats';
import type { PokemonStatsProps } from '$domain/pokemon/value-objects/PokemonStats';
import { PokemonType } from '$domain/pokemon/value-objects/PokemonType';
import { PokemonAbility } from '$domain/pokemon/value-objects/PokemonAbility';

const MAX_TYPES = 2; // Máximo 2 tipos activos

const validatePhysicalAttribute = (label: 'height' | 'weight', value: number) => {
    if (!Number.isFinite(value) || value <= 0) {
        throw new Error(`El ${label} debe ser un número mayor que cero.`);
    }
};

const deduplicateTypes = (types: PokemonType[]) => {
    const seen = new Set<string>();
    return types.filter((type) => {
        const value = type.getValue();
        if (seen.has(value)) {
            return false;
        }
        seen.add(value);
        return true;
    });
};

export type PokemonProps = {
    id: PokemonId;
    name: PokemonName;
    types: PokemonType[];
    abilities: PokemonAbility[];
    stats: PokemonStats;
    height: number;
    weight: number;
};

export class Pokemon {
    private constructor(private readonly props: PokemonProps) { }

    public static createFromPrimitives(primitive: {
        id: number;
        name: string;
        types: string[];
        abilities: { name: string; isHidden: boolean }[];
        stats: PokemonStatsProps;
        height: number;
        weight: number;
    }): Pokemon {
        return Pokemon.create({
            id: PokemonId.create(primitive.id),
            name: PokemonName.create(primitive.name),
            types: primitive.types.map((type) => PokemonType.create(type)),
            abilities: primitive.abilities.map((ability) =>
                PokemonAbility.create(ability.name, ability.isHidden)
            ),
            stats: PokemonStats.create(primitive.stats),
            height: primitive.height,
            weight: primitive.weight
        });
    }

    public static create(props: PokemonProps): Pokemon {
        if (props.types.length === 0) {
            throw new Error('Un Pokémon debe tener al menos un tipo.');
        }

        const uniqueTypes = deduplicateTypes(props.types);

        if (uniqueTypes.length > MAX_TYPES) {
            throw new Error('Un Pokémon no puede tener más de dos tipos.');
        }

        // Validar habilidades
        if (props.abilities.length > 3) {
            throw new Error('Un Pokémon no puede tener más de tres habilidades.');
        }

        validatePhysicalAttribute('height', props.height);
        validatePhysicalAttribute('weight', props.weight);

        return new Pokemon({
            ...props,
            types: uniqueTypes
        });
    }

    public getId(): PokemonId {
        return this.props.id;
    }

    public getName(): PokemonName {
        return this.props.name;
    }

    public getTypes(): PokemonType[] {
        return [...this.props.types];
    }

    public getAbilities(): PokemonAbility[] {
        return [...this.props.abilities];
    }

    public getStats(): PokemonStats {
        return this.props.stats;
    }

    public getHeight(): number {
        return this.props.height;
    }

    public getWeight(): number {
        return this.props.weight;
    }
}
