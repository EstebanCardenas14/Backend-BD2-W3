const redis = require("ioredis");
const colors = require("colors");


module.exports = class RedisConnection {
    constructor() {
        this.client = this.connect();
    }

    connect() {
        let client = new redis({
            host: process.env.REDIS_HOST,
            port: process.env.port,
            retryStrategy(times){
                let delay = Math.min(times * process.env.time_to_retry, 200);
                return delay;
            },
            maxRetriesPerRequest: process.env.retries,
        });

        client.on("connect", () => {
            console.log(`Redis: \x1b[32m%s\x1b[0m`.bold ,'online'. underline.yellow.bold);
        });

        client.on("error", err => {
            console.log(`Redis error: ${err}`.underline.red.bold);
        });

        return client;
    }

    async get(key){
        return await this.client.get(key);
    }

    async set(key, value){
        return await this.client.set(key, value);
    }

   
}