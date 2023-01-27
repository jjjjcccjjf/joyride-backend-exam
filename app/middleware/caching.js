const Redis = require('ioredis');
const responseHelper = require('../helpers/responseHelper');
const redis = new Redis({
    host: 'redis-13854.c84.us-east-1-2.ec2.cloud.redislabs.com',
    port: 13854,
    password: process.env.REDIS_PASSWORD
});
// @Refactor ^^

redisLookup = async (req, res, next) => {

    const { login } = req.body

    const redisUsers = await Promise.all(login.map(async item => {
        const redisItem = await redis.get(item)
        if (redisItem) {
            //remove from login

            const index = login.indexOf(item);
            if (index > -1) { // only splice array when item is found
                login.splice(index, 1); // 2nd parameter means remove one item only
            }

            return redisItem
        }
    }));

    Promise.all(redisUsers)
        .then(() => {
            let filteredArr = redisUsers.filter(el => el !== null && el !== undefined);
            filteredArr = filteredArr.map(el => JSON.parse(el));

            req.body.login = login
            req.body.__fromRedisUsers = filteredArr
            next();
        })

    // return;
    // return;
    // res.json(redisUsers)
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