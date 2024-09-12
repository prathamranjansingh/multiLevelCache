"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheLevel = void 0;
var CacheLevel = /** @class */ (function () {
    function CacheLevel(size, evictionPolicy) {
        this.cache = new Map();
        this.size = size;
        this.evictionPolicy = evictionPolicy;
    }
    CacheLevel.prototype.get = function (key) {
        var item = this.cache.get(key);
        if (item) {
            item.lastAccessed = Date.now();
            item.frequency++;
            this.cache.set(key, item); // Update the item in the cache
        }
        return item;
    };
    CacheLevel.prototype.put = function (key, value, frequency, lastAccessed) {
        if (frequency === void 0) { frequency = 1; }
        if (lastAccessed === void 0) { lastAccessed = Date.now(); }
        var evictedItem = null;
        if (this.cache.size >= this.size) {
            evictedItem = this.evict();
        }
        this.cache.set(key, {
            key: key,
            value: value,
            frequency: frequency,
            lastAccessed: lastAccessed,
        });
        return evictedItem;
    };
    CacheLevel.prototype.evict = function () {
        if (this.evictionPolicy === "LRU") {
            return this.evictLRU();
        }
        else if (this.evictionPolicy === "LFU") {
            return this.evictLFU();
        }
        else {
            throw new Error("Invalid eviction policy");
        }
    };
    CacheLevel.prototype.evictLRU = function () {
        var oldestAccess = Infinity;
        var keyToEvict = null;
        for (var _i = 0, _a = this.cache.entries(); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], item = _b[1];
            if (item.lastAccessed < oldestAccess) {
                oldestAccess = item.lastAccessed;
                keyToEvict = key;
            }
        }
        if (keyToEvict) {
            var evictedItem = this.cache.get(keyToEvict);
            this.cache.delete(keyToEvict);
            return evictedItem;
        }
        return null;
    };
    CacheLevel.prototype.evictLFU = function () {
        var lowestFrequency = Infinity;
        var keyToEvict = null;
        for (var _i = 0, _a = this.cache.entries(); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], item = _b[1];
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
            var evictedItem = this.cache.get(keyToEvict);
            this.cache.delete(keyToEvict);
            return evictedItem;
        }
        return null;
    };
    CacheLevel.prototype.getSize = function () {
        return this.size;
    };
    CacheLevel.prototype.getEvictionPolicy = function () {
        return this.evictionPolicy;
    };
    CacheLevel.prototype.getContents = function () {
        return new Map(this.cache);
    };
    CacheLevel.prototype.isFull = function () {
        return this.cache.size >= this.size;
    };
    CacheLevel.prototype.remove = function (key) {
        var item = this.cache.get(key);
        if (item) {
            this.cache.delete(key);
        }
        return item;
    };
    return CacheLevel;
}());
exports.CacheLevel = CacheLevel;
