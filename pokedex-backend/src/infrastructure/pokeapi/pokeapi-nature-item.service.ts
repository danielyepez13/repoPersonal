import { Injectable } from '@nestjs/common';
import axios from 'axios';
import type { Nature } from '../cache/nature.cache';
import type { Item } from '../cache/item.cache';

/**
 * Servicio para obtener Naturalezas e Items de PokeAPI.
 * Maneja las llamadas HTTP a los endpoints de PokeAPI.
 */
@Injectable()
export class PokeApiNatureItemService {
  private readonly baseUrl = 'https://pokeapi.co/api/v2';

  /**
   * Obtiene una naturaleza de PokeAPI por ID.
   * Extrae solo los campos necesarios: id, name, decreased_stat, increased_stat.
   */
  async fetchNature(id: number): Promise<Nature> {
    try {
      const response = await axios.get(`${this.baseUrl}/nature/${id}`);
      const data = response.data;
      return {
        id: data.id,
        name: data.name,
        decreasedStat: data.decreased_stat?.name || 'unknown',
        increasedStat: data.increased_stat?.name || 'unknown',
      };
    } catch (error) {
      console.error(`Error fetching nature ${id} from PokeAPI:`, error);
      throw new Error(`Failed to fetch nature ${id} from PokeAPI`);
    }
  }

  /**
   * Obtiene un objeto/item de PokeAPI por ID.
   * Extrae solo los campos necesarios: id, name, sprite.
   * El sprite es la primera URL del arreglo de sprites.
   */
  async fetchItem(id: number): Promise<Item> {
    try {
      const response = await axios.get(`${this.baseUrl}/item/${id}`);
      const data = response.data;
      const sprite = data.sprites?.default || undefined;

      return {
        id: data.id,
        name: data.name,
        sprite,
      };
    } catch (error) {
      console.error(`Error fetching item ${id} from PokeAPI:`, error);
      throw new Error(`Failed to fetch item ${id} from PokeAPI`);
    }
  }

  /**
   * Obtiene múltiples naturalezas en paralelo.
   * Útil para precarga o batch loading.
   */
  async fetchNatures(ids: number[]): Promise<Nature[]> {
    const promises = ids.map((id) => this.fetchNature(id));
    return Promise.all(promises);
  }

  /**
   * Obtiene múltiples objetos en paralelo.
   * Útil para precarga o batch loading.
   */
  async fetchItems(ids: number[]): Promise<Item[]> {
    const promises = ids.map((id) => this.fetchItem(id));
    return Promise.all(promises);
  }
}
