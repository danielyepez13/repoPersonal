import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class SearchMovesQuery {
  @Field()
  query: string;

  @Field(() => Int, { nullable: true, defaultValue: 1 })
  page?: number;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  limit?: number;
}
