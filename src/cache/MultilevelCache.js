"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultilevelCache = void 0;
var events_1 = require("events");
var CacheLevel_1 = require("./CacheLevel");
var MultilevelCache = /** @class */ (function (_super) {
    __extends(MultilevelCache, _super);
    function MultilevelCache() {
        var _this = _super.call(this) || this;
        _this.levels = [];
        return _this;
    }
    MultilevelCache.prototype.addCacheLevel = function (size, evictionPolicy) {
        this.levels.push(new CacheLevel_1.CacheLevel(size, evictionPolicy));
        this.emit("cacheAdded", this.levels.length - 1);
    };
    MultilevelCache.prototype.removeCacheLevel = function (level) {
        if (level < 0 || level >= this.levels.length) {
            throw new Error("Invalid cache level");
        }
        this.levels.splice(level, 1);
        this.emit("cacheRemoved", level);
    };
    MultilevelCache.prototype.get = function (key) {
        var foundItem;
        var foundLevel = -1;
        for (var i = 0; i < this.levels.length; i++) {
            var item = this.levels[i].get(key);
            if (item) {
                foundItem = item;
                foundLevel = i;
                break;
            }
        }
        if (foundItem) {
            for (var i = foundLevel - 1; i >= 0; i--) {
                var evictedItem = this.levels[i].put(foundItem.key, foundItem.value, foundItem.frequency, foundItem.lastAccessed);
                if (evictedItem) {
                    this.cascadeEvictedItem(evictedItem, i + 1);
                }
            }
            if (foundLevel > 0) {
                this.levels[foundLevel].remove(key);
            }
            return foundItem.value;
        }
        var value = "Value for ".concat(key, " (fetched from main memory)");
        this.put(key, value);
        return value;
    };
    MultilevelCache.prototype.put = function (key, value) {
        if (this.levels.length === 0) {
            throw new Error("No cache levels available");
        }
        var evictedItem = this.levels[0].put(key, value);
        if (evictedItem) {
            this.cascadeEvictedItem(evictedItem, 1);
        }
    };
    MultilevelCache.prototype.cascadeEvictedItem = function (item, startLevel) {
        for (var i = startLevel; i < this.levels.length; i++) {
            if (!this.levels[i].isFull()) {
                this.levels[i].put(item.key, item.value, item.frequency, item.lastAccessed);
                return;
            }
            var nextEvictedItem = this.levels[i].put(item.key, item.value, item.frequency, item.lastAccessed);
            if (!nextEvictedItem) {
                return;
            }
            item = nextEvictedItem;
        }
    };
    MultilevelCache.prototype.displayCache = function () {
        this.levels.forEach(function (level, index) {
            console.log("Cache Level ".concat(index + 1, ":"));
            console.log("Size: ".concat(level.getSize()));
            console.log("Eviction Policy: ".concat(level.getEvictionPolicy()));
            console.log("Contents:");
            level.getContents().forEach(function (item, key) {
                console.log("  ".concat(key, ": ").concat(item.value, " (freq: ").concat(item.frequency, ", last accessed: ").concat(new Date(item.lastAccessed).toISOString(), ")"));
            });
            console.log("---");
        });
    };
    return MultilevelCache;
}(events_1.EventEmitter));
exports.MultilevelCache = MultilevelCache;
