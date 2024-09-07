"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheLevel = void 0;
class CacheLevel {
    constructor(size, evictionPolicy) {
        this.cache = new Map();
        this.size = size;
        this.evictionPolicy = evictionPolicy;
    }
    get(key) {
        const item = this.cache.get(key);
        if (item) {
            item.lastAccessed = Date.now();
            item.frequency++;
            this.cache.set(key, item); // Update the item in the cache
        }
        return item;
    }
    put(key, value, frequency = 1, lastAccessed = Date.now()) {
        let evictedItem = null;
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
    evict() {
        if (this.evictionPolicy === "LRU") {
            return this.evictLRU();
        }
        else if (this.evictionPolicy === "LFU") {
            return this.evictLFU();
        }
        else {
            throw new Error("Invalid eviction policy");
        }
    }
    evictLRU() {
        let oldestAccess = Infinity;
        let keyToEvict = null;
        for (const [key, item] of this.cache.entries()) {
            if (item.lastAccessed < oldestAccess) {
                oldestAccess = item.lastAccessed;
                keyToEvict = key;
            }
        }
        if (keyToEvict) {
            const evictedItem = this.cache.get(keyToEvict);
            this.cache.delete(keyToEvict);
            return evictedItem;
        }
        return null;
    }
    evictLFU() {
        let lowestFrequency = Infinity;
        let keyToEvict = null;
        for (const [key, item] of this.cache.entries()) {
            if (item.frequency < lowestFrequency) {
                lowestFrequency = item.frequency;
                keyToEvict = key;
            }
            else if (item.frequency === lowestFrequency) {
                if (keyToEvict === null ||
                    item.lastAccessed < this.cache.get(keyToEvict).lastAccessed) {
                    keyToEvict = key;
                }
            }
        }
        if (keyToEvict) {
            const evictedItem = this.cache.get(keyToEvict);
            this.cache.delete(keyToEvict);
            return evictedItem;
        }
        return null;
    }
    getSize() {
        return this.size;
    }
    getEvictionPolicy() {
        return this.evictionPolicy;
    }
    getContents() {
        return new Map(this.cache);
    }
    isFull() {
        return this.cache.size >= this.size;
    }
    remove(key) {
        const item = this.cache.get(key);
        if (item) {
            this.cache.delete(key);
        }
        return item;
    }
}
exports.CacheLevel = CacheLevel;
