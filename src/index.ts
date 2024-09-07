import { MultilevelCache } from "./cache/MultilevelCache";

const cache = new MultilevelCache();

console.log("Adding cache levels...");
cache.addCacheLevel(3, "LRU"); // Add L1 cache with size 3 and LRU policy
cache.addCacheLevel(2, "LFU"); // Add L2 cache with size 2 and LFU policy

console.log("Putting values...");
cache.put("A", "1");
cache.put("B", "2");
cache.put("C", "3");

console.log("Cache state after initial puts:");
cache.displayCache();

console.log("Getting 'A'...");
console.log("Value of A:", cache.get("A")); // Should return "1" from L1

console.log("Putting 'D'...");
cache.put("D", "4"); // L1 is full, should evict least recently used (B) and move it to L2

console.log("Cache state after putting 'D':");
cache.displayCache();

console.log("Getting 'C'...");
console.log("Value of C:", cache.get("C")); // Should return "3" from L1

console.log("Getting 'B'...");
console.log("Value of B:", cache.get("B")); // Should return "2" from L2 and move it back to L1, evicting the least recently used item from L1 to L2

console.log("Cache state after getting 'B':");
cache.displayCache();

console.log("Getting 'E' (not in cache)...");
console.log("Value of E:", cache.get("E")); // Should fetch from main memory and insert into L1

console.log("Final cache state:");
cache.displayCache();
