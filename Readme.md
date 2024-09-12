# Cache System

This project implements a multilevel cache system using TypeScript. The cache system supports two eviction policies: LRU (Least Recently Used) and LFU (Least Frequently Used).
NOTE: Different inputs are also there to check the working of this system. Those are commented in the index.ts So uncomment those lines and check other cases.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)

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
