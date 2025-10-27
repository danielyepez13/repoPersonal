import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class PokemonTypeEntity {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field()
  name: string;

  @Field(() => Int)
  slot: number;
}
