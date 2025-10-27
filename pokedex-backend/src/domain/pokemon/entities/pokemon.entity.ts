import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { PokemonTypeEntity } from './pokemon-type.entity';
import { PokemonAbilityEntity } from './pokemon-ability.entity';
import { PokemonStatEntity } from './pokemon-stat.entity';
import { PokemonMoveEntity } from './pokemon-move.entity';

@ObjectType()
export class Pokemon {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  pokedexNumber: number;

  @Field()
  name: string;

  @Field(() => Int, { nullable: true })
  height?: number;

  @Field(() => Int, { nullable: true })
  weight?: number;

  @Field({ nullable: true })
  spriteUrl?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  createdAt?: Date;

  @Field(() => [PokemonTypeEntity], { nullable: true })
  types?: PokemonTypeEntity[];

  @Field(() => [PokemonAbilityEntity], { nullable: true })
  abilities?: PokemonAbilityEntity[];

  @Field(() => [PokemonStatEntity], { nullable: true })
  stats?: PokemonStatEntity[];

  @Field(() => [PokemonMoveEntity], { nullable: true })
  moves?: PokemonMoveEntity[];

  // Constructor opcional para inicializar desde el dominio
  constructor(partial?: Partial<Pokemon>) {
    if (partial) Object.assign(this, partial);
  }
}
