import { CacheItem } from "./CacheItem";

export class CacheLevel {
  private cache: Map<string, CacheItem>;
  private size: number;
  private evictionPolicy: string;

  constructor(size: number, evictionPolicy: string) {
    this.cache = new Map<string, CacheItem>();
    this.size = size;
    this.evictionPolicy = evictionPolicy;
  }

  get(key: string): CacheItem | undefined {
    const item = this.cache.get(key);
    if (item) {
      item.lastAccessed = Date.now();
      item.frequency++;
      this.cache.set(key, item); // Update the item in the cache
    }
    return item;
  }

  put(
    key: string,
    value: string,
    frequency: number = 1,
    lastAccessed: number = Date.now()
  ): CacheItem | null {
    let evictedItem: CacheItem | null = null;
    if (this.cache.size >= this.size) {
      evictedItem = this.evict();
    }
    this.cache.set(key, {
      key,
      value,
      frequency,
      lastAccessed,
    });
    return evictedItem;
  }

  private evict(): CacheItem | null {
    if (this.evictionPolicy === "LRU") {
      return this.evictLRU();
    } else if (this.evictionPolicy === "LFU") {
      return this.evictLFU();
    } else {
      throw new Error("Invalid eviction policy");
    }
  }

  private evictLRU(): CacheItem | null {
    let oldestAccess = Infinity;
    let keyToEvict: string | null = null;

    for (const [key, item] of this.cache.entries()) {
      if (item.lastAccessed < oldestAccess) {
        oldestAccess = item.lastAccessed;
        keyToEvict = key;
      }
    }

    if (keyToEvict) {
      const evictedItem = this.cache.get(keyToEvict)!;
      this.cache.delete(keyToEvict);
      return evictedItem;
    }

    return null;
  }

  private evictLFU(): CacheItem | null {
    let lowestFrequency = Infinity;
    let keyToEvict: string | null = null;

    for (const [key, item] of this.cache.entries()) {
      if (item.frequency < lowestFrequency) {
        lowestFrequency = item.frequency;
        keyToEvict = key;
      } else if (item.frequency === lowestFrequency) {
        if (
          keyToEvict === null ||
          item.lastAccessed < this.cache.get(keyToEvict)!.lastAccessed
        ) {
          keyToEvict = key;
        }
      }
    }

    if (keyToEvict) {
      const evictedItem = this.cache.get(keyToEvict)!;
      this.cache.delete(keyToEvict);
      return evictedItem;
    }

    return null;
  }

  getSize(): number {
    return this.size;
  }

  getEvictionPolicy(): string {
    return this.evictionPolicy;
  }

  getContents(): Map<string, CacheItem> {
    return new Map(this.cache);
  }

  isFull(): boolean {
    return this.cache.size >= this.size;
  }

  remove(key: string): CacheItem | undefined {
    const item = this.cache.get(key);
    if (item) {
      this.cache.delete(key);
    }
    return item;
  }
}
