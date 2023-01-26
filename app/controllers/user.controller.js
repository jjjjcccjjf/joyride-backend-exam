const Redis = require('ioredis');
const fs = require('fs');
const responseTemplate = require('../helpers/responseTemplate');

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

    // redis.set("mykey", "value");

    // redis.get("mykey").then((result) => {
    //     console.log(result + " from redis"); // Prints "value"
    // });

    const { login } = req.body
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

            console.log("Request failed:", error.request);
            console.log(error.message);
        } else {
            // handle non-GraphQL error
        }
    }

    // Delete key-value pairs that were not found
    // data = Object.fromEntries(Object.entries(data).filter(([key, value]) => value !== null));

    // // Sort the data alphabetically
    // const sortedData = Object.keys(data).sort().reduce(
    //     (obj, key) => {
    //         obj[key] = data[key];
    //         return obj;
    //     },
    //     {}
    // );

    let formattedData = []
    // array.sort((a, b) => {
    //     if (a.login < b.login) {
    //         return -1;
    //     }
    //     if (a.login > b.login) {
    //         return 1;
    //     }
    //     return 0;
    // });
    for (let key in data) {
        if (data[key] !== null) {
            formattedData.push({
                name: data[key].name,
                login: data[key].login,
                company: data[key].company,
                repo_count: data[key].repositories.totalCount,
                followers_count: data[key].followers.totalCount,
                avg_followers_count: data[key].followers.totalCount / data[key].repositories.totalCount
            })
        }
    }

    formattedData.sort((a, b) => {
        if (a.login < b.login) {
            return -1;
        }
        if (a.login > b.login) {
            return 1;
        }
        return 0;
    });

    res.json(responseTemplate(formattedData, errors))
}