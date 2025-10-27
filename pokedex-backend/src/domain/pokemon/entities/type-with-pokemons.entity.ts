import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Pokemon } from './pokemon.entity';

@ObjectType()
export class TypeWithPokemons {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => [Pokemon], { nullable: true })
  pokemons?: Pokemon[];
}
