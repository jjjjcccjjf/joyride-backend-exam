const Redis = require('ioredis');
const fs = require('fs');
const responseHelper = require('../helpers/responseHelper');

const redis = new Redis({
    host: 'redis-13854.c84.us-east-1-2.ec2.cloud.redislabs.com',
    port: 13854,
    password: process.env.REDIS_PASSWORD
});

const { graphql, GraphqlResponseError } = require("@octokit/graphql");
const graphqlWithAuth = graphql.defaults({
    headers: {
        authorization: `bearer ${process.env.GITHUB_PAT}`,
    },
});

exports.list = async (req, res) => {

    const { login } = req.body
    let { __fromRedisUsers } = req.body

    // res.send({login, __fromRedisUsers, reqbody: req.body})

    // return;

    // if login is empty skip map
    const dynamicQuery = login.map(login => `${login}: user(login: "${login}") { ...UserFragment }`).join("\n")
    let data = {};
    let errors = {};

    try {
        
        data = await graphqlWithAuth(`
        {
            ${dynamicQuery}
        }
        
        fragment UserFragment on User {
            name
            login
            company
            repositories(privacy: PUBLIC) {
                totalCount
            }
            followers {
                totalCount
            }
        }`);
    } catch (error) {
        if (error instanceof GraphqlResponseError) {
            data = error.response.data
            errors = error.message
        } else {
            // handle non-GraphQL error
        }
    }

    // Delete key-value pairs that were not found
    if (data) {
        data = Object.fromEntries(Object.entries(data).filter(([key, value]) => value !== null));
    }


    // Sort the data alphabetically
    // const sortedData = Object.keys(data).sort().reduce(
    //     (obj, key) => {
    //         obj[key] = data[key];
    //         return obj;
    //     },
    //     {}
    // );

    // array.sort((a, b) => {
    //     if (a.login < b.login) {
    //         return -1;
    //     }
    //     if (a.login > b.login) {
    //         return 1;
    //     }
    //     return 0;
    // });

    let formattedData = []
    for (let key in data) {
        if (data[key] !== null) {
            formattedData.push(responseHelper.formatData(data[key]))
            redis.set(key, JSON.stringify(data[key]), "EX", 30);
        }
    }

    __fromRedisUsers = __fromRedisUsers.map(item => responseHelper.formatData(item, true))

    formattedData = formattedData.concat(__fromRedisUsers)
    // for (let key in data) {
    //     redis.set(key, JSON.stringify(data[key]), "EX", 30);
    // }

    // res.json(formattedData)
    // return;

    formattedData.sort((a, b) => {
        if (a.login < b.login) {
            return -1;
        }
        if (a.login > b.login) {
            return 1;
        }
        return 0;
    });


    res.json(responseHelper.responseTemplate(formattedData, errors))
}