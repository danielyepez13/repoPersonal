import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class GetPokemonByNameQuery {
  @Field()
  name: string;
}
