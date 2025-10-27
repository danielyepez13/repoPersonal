import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class GetPokemonsQuery {
  @Field(() => Int)
  page: number;

  @Field(() => Int, { defaultValue: 10 })
  limit?: number;

  @Field(() => Int, { defaultValue: 0 })
  offset?: number;
}
