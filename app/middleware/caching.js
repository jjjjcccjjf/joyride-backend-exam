redisLookup = async (req, res, next) => {

    // const {login} = req.body

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