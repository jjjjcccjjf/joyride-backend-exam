require('dotenv').config()
const express = require('express')
const { PrismaClient } = require('@prisma/client');
// const { Octokit } = require("@octokit/core");
// const {
//     restEndpointMethods,
// } = require("@octokit/plugin-rest-endpoint-methods");

const { graphql } = require("@octokit/graphql");

const app = express()
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient()
// const MyOctokit = Octokit.plugin(restEndpointMethods);
// const octokit = new MyOctokit({ auth: process.env.GITHUB_PAT });

const graphqlWithAuth = graphql.defaults({
    headers: {
        authorization: `bearer ${process.env.GITHUB_PAT}`,
    },
});

app.use(express.json())

app.post(`/api/register`, async (req, res) => {
    // Must return JWT
    const { email, password } = req.body

    const result = await prisma.users.create({
        data: {
            email,
            password,
        },
    })
    res.json(result)
})

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body

    // res.json(jwt)
})

// app.get('/api/__list', async (req, res) => {
//     // const { data: { login } } = await octokit.rest.users.getByUsername({
//     // const { data } = await octokit.rest.users.getByUsername({
//     const { data: { name, login, company, followers, public_repos } } = await octokit.rest.users.getByUsername({
//         username: "ro11ingbutler"
//         // }, {
//         //     username: "jjjjcccjjf"
//     });
//     console.log({ name, login, company, followers, public_repos, avg_follower_per_repo: followers / public_repos })
//     console.log(data)
//     res.json(`Hello`)
// })

app.get('/api/list', async (req, res) => {

    const data = await graphqlWithAuth({
        query: `query SearchUsers($login: String!) {
            search(query: $login, type: USER, first: 10) {
              edges {
                node {
                  ... on User {
                    name
                    login
                    company
                    repositories(privacy: PUBLIC) {
                      totalCount
                    }
                    followers {
                      totalCount
                    }
                  }
                }
              }
            }
          }`,
        login: "ro11ingbutler OR jjjjcccjjf"
    });

 
    console.log(data)

    res.json(data)
})



app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})

