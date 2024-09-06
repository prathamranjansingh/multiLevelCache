import { EventEmitter } from "events";

interface CacheItem {
  key: string;
  value: string;
  frequency: number;
  lastAccessed: number;
}

class CacheLevel {
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
        // If frequencies are equal, use LRU as a tie-breaker
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

class MultilevelCache extends EventEmitter {
  private levels: CacheLevel[];

  constructor() {
    super();
    this.levels = [];
  }

  addCacheLevel(size: number, evictionPolicy: string): void {
    this.levels.push(new CacheLevel(size, evictionPolicy));
    this.emit("cacheAdded", this.levels.length - 1);
  }

  removeCacheLevel(level: number): void {
    if (level < 0 || level >= this.levels.length) {
      throw new Error("Invalid cache level");
    }
    this.levels.splice(level, 1);
    this.emit("cacheRemoved", level);
  }

  get(key: string): string | null {
    let foundItem: CacheItem | undefined;
    let foundLevel = -1;

    // Search for the item in all cache levels
    for (let i = 0; i < this.levels.length; i++) {
      const item = this.levels[i].get(key);
      if (item) {
        foundItem = item;
        foundLevel = i;
        break;
      }
    }

    if (foundItem) {
      // Move the item up to higher cache levels
      for (let i = foundLevel - 1; i >= 0; i--) {
        const evictedItem = this.levels[i].put(
          foundItem.key,
          foundItem.value,
          foundItem.frequency,
          foundItem.lastAccessed
        );
        if (evictedItem) {
          this.cascadeEvictedItem(evictedItem, i + 1);
        }
      }

      // Remove the item from its original level if it's not L1
      if (foundLevel > 0) {
        this.levels[foundLevel].remove(key);
      }

      return foundItem.value;
    }

    // If the item is not found in any cache level, simulate fetching from main memory
    const value = `Value for ${key} (fetched from main memory)`;
    this.put(key, value);
    return value;
  }

  put(key: string, value: string): void {
    if (this.levels.length === 0) {
      throw new Error("No cache levels available");
    }
    const evictedItem = this.levels[0].put(key, value);
    if (evictedItem) {
      this.cascadeEvictedItem(evictedItem, 1);
    }
  }

  private cascadeEvictedItem(item: CacheItem, startLevel: number): void {
    for (let i = startLevel; i < this.levels.length; i++) {
      if (!this.levels[i].isFull()) {
        this.levels[i].put(
          item.key,
          item.value,
          item.frequency,
          item.lastAccessed
        );
        return;
      }
      const nextEvictedItem = this.levels[i].put(
        item.key,
        item.value,
        item.frequency,
        item.lastAccessed
      );
      if (!nextEvictedItem) {
        return;
      }
      item = nextEvictedItem;
    }
    // If we reach here, the item has been evicted from all levels
  }

  displayCache(): void {
    this.levels.forEach((level, index) => {
      console.log(`Cache Level ${index + 1}:`);
      console.log(`Size: ${level.getSize()}`);
      console.log(`Eviction Policy: ${level.getEvictionPolicy()}`);
      console.log("Contents:");
      level.getContents().forEach((item, key) => {
        console.log(
          `  ${key}: ${item.value} (freq: ${
            item.frequency
          }, last accessed: ${new Date(item.lastAccessed).toISOString()})`
        );
      });
      console.log("---");
    });
  }
}

export default MultilevelCache;
