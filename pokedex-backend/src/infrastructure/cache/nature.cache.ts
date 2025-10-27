import { Injectable } from '@nestjs/common';

/**
 * Interfaz para representar una Naturaleza de Pokémon.
 * Las naturalezas afectan las estadísticas base del Pokémon.
 */
export interface Nature {
  id: number;
  name: string;
  decreasedStat: string;
  increasedStat: string;
}

/**
 * Servicio de caché para Naturalezas.
 * Implementa Lazy Loading: cachea conforme se usan.
 * Evita múltiples llamadas a PokeAPI para la misma naturaleza.
 */
@Injectable()
export class NatureCache {
  private cache: Map<number, Nature> = new Map();

  /**
   * Obtiene una naturaleza del caché.
   * Retorna undefined si no está en caché.
   */
  get(id: number): Nature | undefined {
    return this.cache.get(id);
  }

  /**
   * Guarda una naturaleza en el caché.
   */
  set(id: number, nature: Nature): void {
    this.cache.set(id, nature);
  }

  /**
   * Verifica si una naturaleza está en caché.
   */
  has(id: number): boolean {
    return this.cache.has(id);
  }

  /**
   * Obtiene todas las naturalezas en caché.
   */
  getAll(): Nature[] {
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
