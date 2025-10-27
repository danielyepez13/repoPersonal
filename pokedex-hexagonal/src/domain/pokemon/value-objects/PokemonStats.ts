export type PokemonStatsProps = {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
};

const validateStat = (statName: keyof PokemonStatsProps, value: number) => {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`El stat ${statName} debe ser un entero mayor o igual a 0.`);
  }
};

export class PokemonStats {
  private constructor(private readonly props: PokemonStatsProps) {}

  public static create(props: PokemonStatsProps): PokemonStats {
    Object.entries(props).forEach(([key, value]) => validateStat(key as keyof PokemonStatsProps, value));
    return new PokemonStats(props);
  }

  public getProps(): PokemonStatsProps {
    return { ...this.props };
  }
}
