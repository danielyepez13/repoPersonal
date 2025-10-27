/**
 * Query para crear un nuevo equipo de Pokémon.
 */
export class CreateTeamQuery {
  constructor(
    public readonly ownerId: number,
    public readonly name: string,
    public readonly pokemons: Array<{
      pokemonId: number;
      slot: number;
      nickname?: string;
      level?: number;
      natureId?: number;
      itemId?: number;
    }>,
  ) {}
}
