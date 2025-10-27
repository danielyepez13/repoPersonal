import { ObjectType, Field, Int } from '@nestjs/graphql';

/**
 * Tipo GraphQL para representar un Pokémon en un equipo.
 */
@ObjectType()
export class TeamPokemonType {
  @Field(() => Int)
  pokemonId: number;

  @Field(() => Int)
  slot: number;

  @Field(() => String, { nullable: true })
  nickname?: string;

  @Field(() => Int)
  level: number;

  @Field(() => Int, { nullable: true })
  natureId?: number;

  @Field(() => Int, { nullable: true })
  itemId?: number;
}

/**
 * Tipo GraphQL para representar un equipo de Pokémon.
 */
@ObjectType()
export class TeamType {
  @Field(() => Int)
  id: number;

  @Field(() => Int, { nullable: true })
  ownerId?: number;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String)
  createdAt: string;

  @Field(() => [TeamPokemonType])
  pokemons: TeamPokemonType[];
}
