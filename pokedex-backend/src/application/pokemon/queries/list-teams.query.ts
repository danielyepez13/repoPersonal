/**
 * Query para listar todos los equipos con paginación.
 */
export class ListTeamsQuery {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 10,
  ) {}
}
