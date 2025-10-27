const MAX_NAME_LENGTH = 50;

export class PokemonAbility {
    private constructor(
        private readonly name: string,
        private readonly isHidden: boolean
    ) { }

    public static create(name: string, isHidden: boolean): PokemonAbility {
        const normalized = name?.trim();

        if (!normalized) {
            throw new Error('El nombre de la habilidad no puede estar vacío.');
        }

        if (normalized.length > MAX_NAME_LENGTH) {
            throw new Error('El nombre de la habilidad excede la longitud permitida.');
        }

        return new PokemonAbility(normalized, isHidden);
    }

    public getName(): string {
        return this.name;
    }

    public getIsHidden(): boolean {
        return this.isHidden;
    }
}
