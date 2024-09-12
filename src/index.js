"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MultilevelCache_1 = require("./cache/MultilevelCache");
// Cache setup kar rahe hain
var cache = new MultilevelCache_1.MultilevelCache();
console.log("Adding cache levels...");
cache.addCacheLevel(3, "LRU"); // L1 cache bana, size 3 aur LRU policy hai
cache.addCacheLevel(2, "LFU"); // L2 cache bana, size 2 aur LFU policy hai
console.log("Putting values into the cache...");
cache.put("A", "1"); // A ko 1 value ke sath daal diya
cache.put("B", "2"); // B ko 2 value ke sath daal diya
cache.put("C", "3"); // C bhi daal diya with value 3
console.log("Cache state after initial puts:");
cache.displayCache();
console.log("A ko get kar rahe hain...");
console.log("Value of A:", cache.get("A"));
console.log("D ko cache mein daal rahe hain...");
cache.put("D", "4"); // L1 full ho gaya, to B ko L2 mein bhej denge
console.log("Cache state after putting 'D':");
cache.displayCache(); // Dekho ab cache mein kya ho raha hai D ke baad
console.log("Getting the value of C.");
console.log("Value of C:", cache.get("C")); // C ki value L1 se mil jayegi, 3
// console.log("Ab B ko wapas le rahe hain...");
// console.log("Value of B:", cache.get("B")); // B ab L2 mein hai, wapas L1 mein aa jayega
console.log("Cache state after getting 'B':");
cache.displayCache(); // B ko wapas laane ke baad cache ka haal dekhte hain
// console.log("Getting E value...");
// console.log("Value of E:", cache.get("E")); // E to nahi hai cache mein, to main memory se uthayenge aur L1 mein daalenge
console.log("Final cache state:");
cache.displayCache();
