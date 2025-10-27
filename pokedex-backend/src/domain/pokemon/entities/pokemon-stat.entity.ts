import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class PokemonStatEntity {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field()
  name: string;

  @Field(() => Int)
  baseStat: number;

  @Field(() => Int)
  effort: number;
}
