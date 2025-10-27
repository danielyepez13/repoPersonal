export class PokemonId {
  private constructor(private readonly value: number) {}

  public static create(value: number): PokemonId {
    if (!Number.isInteger(value) || value <= 0) {
      throw new Error('El identificador del Pokémon debe ser un entero positivo.');
    }

    return new PokemonId(value);
  }

  public getValue(): number {
    return this.value;
  }
}
