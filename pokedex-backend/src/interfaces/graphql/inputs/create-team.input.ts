import { InputType, Field, Int } from '@nestjs/graphql';

/**
 * Input para un Pokémon en un equipo.
 */
@InputType()
export class TeamPokemonInput {
  @Field(() => Int)
  pokemonId: number;

  @Field(() => Int)
  slot: number;

  @Field(() => String, { nullable: true })
  nickname?: string;

  @Field(() => Int, { nullable: true })
  level?: number;

  @Field(() => Int, { nullable: true })
  natureId?: number;

  @Field(() => Int, { nullable: true })
  itemId?: number;
}

/**
 * Input para crear un nuevo equipo de Pokémon.
 */
@InputType()
export class CreateTeamInput {
  @Field(() => Int)
  ownerId: number;

  @Field(() => String)
  name: string;

  @Field(() => [TeamPokemonInput])
  pokemons: TeamPokemonInput[];
}

/**
 * Input para actualizar un equipo de Pokémon.
 */
@InputType()
export class UpdateTeamInput {
  @Field(() => Int)
  teamId: number;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => [TeamPokemonInput], { nullable: true })
  pokemons?: TeamPokemonInput[];
}
