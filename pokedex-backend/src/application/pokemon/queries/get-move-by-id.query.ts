import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class GetMoveByIdQuery {
  @Field(() => Int)
  id: number;
}
