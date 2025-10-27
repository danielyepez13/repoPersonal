/**
 * Query para obtener un equipo de Pokémon por ID.
 */
export class GetTeamQuery {
  constructor(public readonly teamId: number) {}
}
