import { EventEmitter } from "events";
import { CacheLevel } from "./CacheLevel";
import { CacheItem } from "./CacheItem"; // Import CacheItem

export class MultilevelCache extends EventEmitter {
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

    for (let i = 0; i < this.levels.length; i++) {
      const item = this.levels[i].get(key);
      if (item) {
        foundItem = item;
        foundLevel = i;
        break;
      }
    }

    if (foundItem) {
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

      if (foundLevel > 0) {
        this.levels[foundLevel].remove(key);
      }

      return foundItem.value;
    }

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
