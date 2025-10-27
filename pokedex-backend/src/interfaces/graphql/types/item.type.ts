import { ObjectType, Field, Int } from '@nestjs/graphql';

/**
 * Tipo GraphQL para representar un Objeto/Item de Pokémon.
 */
@ObjectType()
export class ItemType {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  sprite?: string;
}
