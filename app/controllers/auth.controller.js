const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const responseTemplate = require("../helpers/responseTemplate")

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
        res.status(500).json(responseTemplate({}, err.message));
    });

    delete result.password

    res.json(responseTemplate(result, ""))
};

exports.login = async (req, res) => {
    const { email, password } = req.body

    await prisma.users.findFirst({
        where: {
            email: email
        }
    }).then(user => {
        if (!user) {
            return res.status(400).json(responseTemplate({}, "User not found or invalid request payload. See documentation for more info: https://github.com/jjjjcccjjf/joyride-backend-exam"));
        }

        const passwordIsValid = bcrypt.compareSync(
            password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(400).json(responseTemplate({}, "Invalid credentials."));
        }

        const token = jwt.sign({ id: user.id }, process.env.APP_SECRET, {
            expiresIn: 86400 // 24 hours
        });

        delete user.password
        user.accessToken = token

        res.json(responseTemplate(user, ""));

    }).catch(err => {
        res.status(500).json(responseTemplate({}, err.message));
    });


};