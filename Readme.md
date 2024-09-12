# Cache System

This project implements a multilevel cache system using TypeScript. The cache system supports two eviction policies: LRU (Least Recently Used) and LFU (Least Frequently Used).
NOTE: Different inputs are also there to check the working of this system. Those are commented in the index.ts So uncomment those lines and check other cases.

## Table of Contents

- [ProblemStatement](#ProblemStatement)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)

## ProblemStatement

### 1. Cache Levels

- **Multiple Cache Levels:** The system supports multiple cache levels (L1, L2, ..., Ln).
- **Configurable Size:** Each cache level can be configured with its own size, i.e., the number of entries it can hold.
- **Data Retrieval:** Data is retrieved starting from the highest-priority cache level (L1). If not found in L1, the system checks lower levels sequentially until it finds the data or returns a cache miss.

### 2. Eviction Policies

- **Support for Eviction Policies:** The system implements support for at least one of the following eviction policies:
  - **Least Recently Used (LRU):** Evicts the least recently accessed item.
  - **Least Frequently Used (LFU):** Evicts the least frequently accessed item.
- **Uniform Policy:** All cache levels share the same eviction policy.

### 3. Data Retrieval and Insertion

- **Data Retrieval:**
  - If data is found in any lower cache level, it is moved up to higher cache levels (L1, L2, etc.), following the defined eviction policy.
  - If data is not present in any cache, it is simulated as fetched from the main memory and stored in L1 cache.
- **Data Insertion:**
  - New data is always inserted into the L1 cache level. Items may be evicted from L1 if necessary.

### 4. Dynamic Cache Level Management

- **Add/Remove Cache Levels:** The system allows dynamic addition and removal of cache levels at runtime.
- **Custom Size and Policy:** Each new cache level can specify its own size and eviction policy.

### 5. Concurrency (Bonus)

- **Thread Safety:** The system is designed to handle concurrent reads and writes to the cache, ensuring thread safety.

### 6. Performance Considerations

- **Efficient Lookups:** The system ensures efficient lookups and aims to minimize cache misses.
- **Optimized Data Movement:** Data movement across cache levels is optimized to enhance performance when data is found in lower levels.

## Features

- **Multilevel Caching:** Supports multiple cache levels with different eviction policies.
- **LRU and LFU Policies:** Can configure cache levels with LRU or LFU eviction policies.
- **Dynamic Cache Management:** Automatically handles cache eviction based on the configured policy.

## Installation

To set up this project on your local machine, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/prathamranjansingh/multiLevelCache.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd multiLevelCache
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

## Usage

1. **Build the project:**

   Compile the TypeScript files to JavaScript using:

   ```bash
   npm run build
   ```

2. **Run the project:**

   Start the application using:

   ```bash
   npm start
   ```

This will execute the compiled dist/index.js file.
