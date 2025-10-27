import { ObjectType, Field, Int } from '@nestjs/graphql';

/**
 * Tipo GraphQL para representar una Naturaleza de Pokémon.
 */
@ObjectType()
export class NatureType {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  decreasedStat: string;

  @Field(() => String)
  increasedStat: string;
}
