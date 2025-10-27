/**
 * Query para actualizar un equipo de Pokémon existente.
 */
export class UpdateTeamQuery {
  constructor(
    public readonly teamId: number,
    public readonly name?: string,
    public readonly pokemons?: Array<{
      pokemonId: number;
      slot: number;
      nickname?: string;
      level?: number;
      natureId?: number;
      itemId?: number;
    }>,
  ) {}
}
