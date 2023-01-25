require('dotenv').config()
const express = require('express')
const { PrismaClient } = require('@prisma/client')

const app = express()
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient()


app.use(express.json())

app.get('/', async (req, res) => {
    res.send('Hello World!')
})

app.post(`/register`, async (req, res) => {
    const { email, password } = req.body

    const result = await prisma.users.create({
        data: {
            email,
            password,
        },
    })
    res.json(result)
    console.log(email, password)
})


app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})

