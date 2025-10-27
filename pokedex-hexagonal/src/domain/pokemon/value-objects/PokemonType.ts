const MAX_LENGTH = 50;

export class PokemonType {
  private constructor(private readonly value: string) {}

  public static create(value: string): PokemonType {
    const normalized = value?.trim().toLowerCase();

    if (!normalized) {
      throw new Error('El tipo del Pokémon no puede estar vacío.');
    }

    if (normalized.length > MAX_LENGTH) {
      throw new Error('El tipo del Pokémon excede la longitud permitida.');
    }

    return new PokemonType(normalized);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: PokemonType): boolean {
    return this.value === other.value;
  }
}
