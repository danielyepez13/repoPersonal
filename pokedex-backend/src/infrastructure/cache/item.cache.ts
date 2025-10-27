import { Injectable } from '@nestjs/common';

/**
 * Interfaz para representar un Objeto/Item de Pokémon.
 * Los objetos pueden ser sostenidos por Pokémon en batalla.
 */
export interface Item {
  id: number;
  name: string;
  sprite?: string;
}

/**
 * Servicio de caché para Objetos/Items.
 * Implementa Lazy Loading: cachea conforme se usan.
 * Evita múltiples llamadas a PokeAPI para el mismo objeto.
 */
@Injectable()
export class ItemCache {
  private cache: Map<number, Item> = new Map();

  /**
   * Obtiene un objeto del caché.
   * Retorna undefined si no está en caché.
   */
  get(id: number): Item | undefined {
    return this.cache.get(id);
  }

  /**
   * Guarda un objeto en el caché.
   */
  set(id: number, item: Item): void {
    this.cache.set(id, item);
  }

  /**
   * Verifica si un objeto está en caché.
   */
  has(id: number): boolean {
    return this.cache.has(id);
  }

  /**
   * Obtiene todos los objetos en caché.
   */
  getAll(): Item[] {
    return Array.from(this.cache.values());
  }

  /**
   * Limpia el caché completamente.
   * Útil para tests o cuando necesitas recargar datos.
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Obtiene el tamaño actual del caché.
   */
  size(): number {
    return this.cache.size;
  }
}
