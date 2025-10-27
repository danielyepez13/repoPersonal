import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class SearchPokemonsQuery {
  @Field()
  query: string;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  limit?: number;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  offset?: number;
}
