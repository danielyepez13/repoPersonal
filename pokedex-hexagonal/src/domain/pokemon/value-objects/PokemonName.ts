export class PokemonName {
  private constructor(private readonly value: string) {}

  public static create(value: string): PokemonName {
    const normalized = value?.trim().toLowerCase();

    if (!normalized) {
      throw new Error('El nombre del Pokémon no puede estar vacío.');
    }

    if (normalized.length > 255) {
      throw new Error('El nombre del Pokémon no puede exceder los 255 caracteres.');
    }

    return new PokemonName(normalized);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: PokemonName): boolean {
    return this.value === other.value;
  }
}
