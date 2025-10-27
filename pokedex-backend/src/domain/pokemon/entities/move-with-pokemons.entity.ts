import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Pokemon } from './pokemon.entity';
import { MoveTypeEntity } from './move.entity';

@ObjectType()
export class MoveWithPokemons {
  @Field(() => Int)
  id: number;

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

  @Field(() => [Pokemon], { nullable: true })
  pokemons?: Pokemon[];
}
