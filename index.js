require('dotenv').config()
const express = require('express')
// const { PrismaClient } = require('@prisma/client');
// const { graphql, GraphqlResponseError } = require("@octokit/graphql");
const cors = require("cors");

const app = express()
const PORT = process.env.PORT || 3000;
// const prisma = new PrismaClient()

// const graphqlWithAuth = graphql.defaults({
//     headers: {
//         authorization: `bearer ${process.env.GITHUB_PAT}`,
//     },
// });

app.use(express.json())
app.use(cors())

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})



// app.get(`/api/test`, async (req, res) => {
//     // Must return JWT

//     res.json(result)
// })



// app.post(`/api/test2`, async (req, res) => {
//     const { email, password } = req.body

//     const data = await prisma.users.findFirst({
//         where: {
//             email: email
//         }
//     })

//     res.json(data)
// })


// app.post(`/api/register`, async (req, res) => {
//     // Must return JWT
//     const { email, password } = req.body

//     const result = await prisma.users.create({
//         data: {
//             email,
//             password,
//         },
//     })
//     res.json(result)
// })

// app.post('/api/login', async (req, res) => {
//     const { login } = req.body

//     // res.json(jwt)
// })

// app.post('/api/list', async (req, res) => {

//     const { login } = req.body
//     // const logins = login.join(" OR ");

//     // const { search } = await graphqlWithAuth({
//     //     query: `query SearchUsers($login: String!) {
//     //         search(query: $login, type: USER, first: 10) {
//     //           edges {
//     //             node {
//     //               ... on User {
//     //                 name
//     //                 login
//     //                 company
//     //                 repositories(privacy: PUBLIC) {
//     //                   totalCount
//     //                 }
//     //                 followers {
//     //                   totalCount
//     //                 }
//     //               }
//     //             }
//     //           }
//     //         }
//     //       }`, 
//     //     login: logins
//     // });

//     const dynamicQuery = login.map(login => `${login}: user(login: "${login}") { ...UserFragment }`).join("\n")

//     let data = {};

//     try {
//         data = await graphqlWithAuth(`
//             {
//             ${dynamicQuery}
//         }
        
//         fragment UserFragment on User {
//             name
//             login
//             company
//             repositories(privacy: PUBLIC) {
//                 totalCount
//             }
//             followers {
//                 totalCount
//             }
//         }`);
//     } catch (error) {
//         if (error instanceof GraphqlResponseError) {
//             data = error.response.data
//             console.log("Request failed:", error.request); // { query, variables: {}, headers: { authorization: 'token secret123' } }
//             console.log(error.message); // Field 'bioHtml' doesn't exist on type 'User'
//         } else {
//             // handle non-GraphQL error
//         }
//     }

//     const sortedData = Object.keys(data).sort().reduce(
//         (obj, key) => {
//             obj[key] = data[key];
//             return obj;
//         },
//         {}
//     );



//     // console.log(dynamicQuery)

//     // const sortedData = search.edges.sort(({node: a}, {node: b}) => a.name.localeCompare(b.name))
//     // res.json(sortedData)

//     // const userNames = search.edges.map(edge => edge.node.name);
//     // console.log(userNames);

//     // res.json('asd')
//     res.json(sortedData)
// })

