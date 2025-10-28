import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class MoveTypeEntity {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field()
  name: string;
}

@ObjectType()
export class MoveEntity {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Int)
  pokeApiId: number;

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

  @Field()
  category: string; // 'physical', 'special', 'status'

  @Field(() => MoveTypeEntity)
  type: MoveTypeEntity;
}
