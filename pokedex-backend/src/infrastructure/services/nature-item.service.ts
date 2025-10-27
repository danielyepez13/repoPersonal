import { Injectable } from '@nestjs/common';
import { NatureCache, type Nature } from '../cache/nature.cache';
import { ItemCache, type Item } from '../cache/item.cache';
import { PokeApiNatureItemService } from '../pokeapi/pokeapi-nature-item.service';
import { PrismaPokemonRepository } from '../prisma/repositories/prisma-pokemon.repository';

/**
 * Servicio que implementa Lazy Loading con Caché Local para Naturalezas e Items.
 * Flujo:
 * 1. Verificar caché local
 * 2. Si no está, verificar BD
 * 3. Si no existe, obtener de PokeAPI
 * 4. Guardar en BD y caché local
 */
@Injectable()
export class NatureItemService {
  constructor(
    private readonly natureCache: NatureCache,
    private readonly itemCache: ItemCache,
    private readonly pokeApiService: PokeApiNatureItemService,
    private readonly pokemonRepository: PrismaPokemonRepository,
  ) {}

  /**
   * Obtiene una naturaleza aplicando Lazy Loading.
   * Prioridad: Caché Local → BD → PokeAPI
   */
  async getNature(id: number): Promise<Nature> {
    // 1. Verificar caché local
    if (this.natureCache.has(id)) {
      return this.natureCache.get(id)!;
    }

    // 2. Verificar BD
    let nature = await this.pokemonRepository.findNatureById(id);

    // 3. Si no existe, obtener de PokeAPI
    if (!nature) {
      nature = await this.pokeApiService.fetchNature(id);
      await this.pokemonRepository.saveNature(nature);
    }

    // 4. Guardar en caché local
    this.natureCache.set(id, nature);
    return nature;
  }

  /**
   * Obtiene un objeto/item aplicando Lazy Loading.
   * Prioridad: Caché Local → BD → PokeAPI
   */
  async getItem(id: number): Promise<Item> {
    // 1. Verificar caché local
    if (this.itemCache.has(id)) {
      return this.itemCache.get(id)!;
    }

    // 2. Verificar BD
    let item = await this.pokemonRepository.findItemById(id);

    // 3. Si no existe, obtener de PokeAPI
    if (!item) {
      item = await this.pokeApiService.fetchItem(id);
      await this.pokemonRepository.saveItem(item);
    }

    // 4. Guardar en caché local
    this.itemCache.set(id, item);
    return item;
  }

  /**
   * Obtiene múltiples naturalezas en paralelo.
   * Optimiza usando batch loading.
   */
  async getNatures(ids: number[]): Promise<Nature[]> {
    return Promise.all(ids.map((id) => this.getNature(id)));
  }

  /**
   * Obtiene múltiples objetos en paralelo.
   * Optimiza usando batch loading.
   */
  async getItems(ids: number[]): Promise<Item[]> {
    return Promise.all(ids.map((id) => this.getItem(id)));
  }

  /**
   * Limpia los cachés locales.
   * Útil para tests o cuando necesitas recargar datos.
   */
  clearCaches(): void {
    this.natureCache.clear();
    this.itemCache.clear();
  }

  /**
   * Obtiene estadísticas del caché.
   */
  getCacheStats(): {
    natures: number;
    items: number;
  } {
    return {
      natures: this.natureCache.size(),
      items: this.itemCache.size(),
    };
  }
}
