import { ObjectType, Field, Int } from '@nestjs/graphql';
import { MoveTypeEntity } from './move.entity';

@ObjectType()
export class PokemonMoveEntity {
  @Field()
  name: string;

  @Field(() => Int, { nullable: true })
  power?: number;

  @Field(() => Int, { nullable: true })
  pp?: number;

  @Field(() => Int, { nullable: true })
  priority?: number;

  @Field(() => Int, { nullable: true })
  accuracy?: number;

  @Field(() => MoveTypeEntity)
  type: MoveTypeEntity;

  @Field(() => Int, { nullable: true })
  levelLearnedAt?: number;

  @Field({ nullable: true })
  moveLearnMethod?: string;
}
