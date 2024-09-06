import express from "express";
import MultilevelCache from "./MultilevelCache";

const app = express();
const cache = new MultilevelCache();

// Initialize cache levels
cache.addCacheLevel(100, "LRU");
cache.addCacheLevel(200, "LFU");

app.use(express.json());

app.get("/cache/:key", (req, res) => {
  const { key } = req.params;
  const value = cache.get(key);
  res.json({ key, value });
});

app.post("/cache", (req, res) => {
  const { key, value } = req.body;
  cache.put(key, value);
  res.status(201).json({ message: "Value cached successfully" });
});

app.get("/cache", (req, res) => {
  cache.displayCache();
  res.json({ message: "Cache state logged to console" });
});

app.post("/cache/level", (req, res) => {
  const { size, evictionPolicy } = req.body;
  cache.addCacheLevel(size, evictionPolicy);
  res.status(201).json({ message: "Cache level added successfully" });
});

app.delete("/cache/level/:level", (req, res) => {
  const level = parseInt(req.params.level);
  cache.removeCacheLevel(level);
  res.json({ message: "Cache level removed successfully" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
