require('dotenv').config()
const express = require('express')
const { PrismaClient } = require('@prisma/client');
const { Octokit } = require("@octokit/core");
const {
    restEndpointMethods,
} = require("@octokit/plugin-rest-endpoint-methods");

const app = express()
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient()
const MyOctokit = Octokit.plugin(restEndpointMethods);
const octokit = new MyOctokit({ auth: process.env.GITHUB_PAT });

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

app.get('/api/list', async (req, res) => {
    // const { data: { login } } = await octokit.rest.users.getByUsername({
    // const { data } = await octokit.rest.users.getByUsername({
    const { data: { name, login, company, followers, public_repos } } = await octokit.rest.users.getByUsername({
        username: "ro11ingbutler"
    });
    console.log({ name, login, company, followers, public_repos, avg_follower_per_repo: followers / public_repos })
    res.json(`Hello`)
})

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})

