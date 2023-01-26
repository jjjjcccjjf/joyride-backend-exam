const Redis = require('ioredis');
const redis = new Redis({
    host: 'redis-13854.c84.us-east-1-2.ec2.cloud.redislabs.com',
    port: 13854,
    password: process.env.REDIS_PASSWORD
});
// @Refactor ^^

redisLookup = async (req, res, next) => {

    const { login } = req.body

    const all = await redis.mget(...login);
    console.log(all); // [ 'Bob', '20', 'I am a programmer' ]

    res.send("stopped by redis!")
    return;
    // try {
    //     const cacheResults = await redisClient.get(species);
    //     if (cacheResults) {
    //         isCached = true;
    //         results = JSON.parse(cacheResults);
    //     } else {
    //         results = await fetchApiData(species);
    //         if (results.length === 0) {
    //             throw "API returned an empty array";
    //         }
    //     }

    //     res.send({
    //         fromCache: isCached,
    //         data: results,
    //     });
    // } catch (error) {
    //     res.status(400).send({
    //         message: "Bad request. Username is already in use!"
    //     });
    //     return;
    // }
}


const caching = {
    redisLookup: redisLookup
}

module.exports = caching