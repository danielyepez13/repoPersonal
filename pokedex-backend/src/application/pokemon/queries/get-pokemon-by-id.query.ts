import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class GetPokemonByIdQuery {
  @Field(() => Int)
  id: number;
}
