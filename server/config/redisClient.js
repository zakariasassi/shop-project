const   { createClient } = require('redis');

const redisClient = createClient();

// Connect to Redis
try {
    if (!redisClient.isOpen) {
        await redisClient.connect();
      }  console.log("Redis connected");
} catch (err) {
  console.error("Redis Connection Error:", err);
}

// Handle Redis errors
redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

redisClient.on("end", () => {
  console.log("Redis client disconnected");
});


module.exports = redisClient