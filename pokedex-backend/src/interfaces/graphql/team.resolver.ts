import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CreateTeamHandler } from '@/application/pokemon/handlers/create-team.handler';
import { GetTeamHandler } from '@/application/pokemon/handlers/get-team.handler';
import { UpdateTeamHandler } from '@/application/pokemon/handlers/update-team.handler';
import { DeleteTeamHandler } from '@/application/pokemon/handlers/delete-team.handler';
import { ListTeamsHandler } from '@/application/pokemon/handlers/list-teams.handler';
import { CreateTeamQuery } from '@/application/pokemon/queries/create-team.query';
import { GetTeamQuery } from '@/application/pokemon/queries/get-team.query';
import { UpdateTeamQuery } from '@/application/pokemon/queries/update-team.query';
import { DeleteTeamQuery } from '@/application/pokemon/queries/delete-team.query';
import { ListTeamsQuery } from '@/application/pokemon/queries/list-teams.query';
import { TeamType } from './types/team.type';
import {
  CreateTeamInput,
  TeamPokemonInput,
  UpdateTeamInput,
} from './inputs/create-team.input';

/**
 * Resolver GraphQL para operaciones de equipos de Pokémon.
 */
@Resolver(() => TeamType)
export class TeamResolver {
  constructor(
    private readonly createTeamHandler: CreateTeamHandler,
    private readonly getTeamHandler: GetTeamHandler,
    private readonly updateTeamHandler: UpdateTeamHandler,
    private readonly deleteTeamHandler: DeleteTeamHandler,
    private readonly listTeamsHandler: ListTeamsHandler,
  ) {}

  /**
   * Query para obtener un equipo por ID.
   * Retorna el equipo con todos sus Pokémon y sus relaciones.
   */
  @Query(() => TeamType, { nullable: true })
  async team(@Args('id', { type: () => Int }) id: number): Promise<any> {
    const query = new GetTeamQuery(id);
    return this.getTeamHandler.execute(query);
  }

  /**
   * Query para listar todos los equipos con paginación.
   */
  @Query(() => [TeamType])
  async teams(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ): Promise<any[]> {
    const query = new ListTeamsQuery(page, limit);
    return this.listTeamsHandler.execute(query);
  }

  /**
   * Mutation para crear un nuevo equipo de Pokémon.
   * Valida que el equipo tenga máximo 6 Pokémon.
   */
  @Mutation(() => TeamType)
  async createTeam(@Args('input') input: CreateTeamInput): Promise<any> {
    const query = new CreateTeamQuery(
      input.ownerId,
      input.name,
      input.pokemons.map((p: TeamPokemonInput) => ({
        pokemonId: p.pokemonId,
        slot: p.slot,
        nickname: p.nickname,
        level: p.level,
        natureId: p.natureId,
        itemId: p.itemId,
      })),
    );
    return this.createTeamHandler.execute(query);
  }

  /**
   * Mutation para actualizar un equipo existente.
   * Permite actualizar el nombre y/o los Pokémon del equipo.
   */
  @Mutation(() => TeamType)
  async updateTeam(@Args('input') input: UpdateTeamInput): Promise<any> {
    const query = new UpdateTeamQuery(
      input.teamId,
      input.name,
      input.pokemons?.map((p: TeamPokemonInput) => ({
        pokemonId: p.pokemonId,
        slot: p.slot,
        nickname: p.nickname,
        level: p.level,
        natureId: p.natureId,
        itemId: p.itemId,
      })),
    );
    return this.updateTeamHandler.execute(query);
  }

  /**
   * Mutation para eliminar un equipo.
   */
  @Mutation(() => Boolean)
  async deleteTeam(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    const query = new DeleteTeamQuery(id);
    await this.deleteTeamHandler.execute(query);
    return true;
  }
}
