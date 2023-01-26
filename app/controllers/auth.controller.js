const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.register = async (req, res) => {

    const { email, password } = req.body

    const result = await prisma.users.create({
        data: {
            email,
            password: bcrypt.hashSync(password, 8),
        },
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });

    res.json(result)
};

exports.login = async (req, res) => {
    const { email, password } = req.body

    const result = await prisma.users.findFirst({
        where: {
            email: email
        }
    }).then(user => {
        if (!user) {
            return res.status(400).send({ message: "User Not found." });
        }

        const passwordIsValid = bcrypt.compareSync(
            password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!"
            });
        }

        const token = jwt.sign({ id: user.id }, process.env.APP_SECRET, {
            expiresIn: 86400 // 24 hours
        });

        // res.status(200).send({
        res.json({
            id: user.id,
            email: user.email,
            accessToken: token
        });

    }).catch(err => {
        res.status(500).send({ message: err.message });
    });


};