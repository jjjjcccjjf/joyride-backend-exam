const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const responseTemplate = require("../helpers/responseTemplate")


checkRequestBody = async (req, res, next) => {
    const { email, password } = req.body
    console.log(email, password)
    if (!email || !password) {
        res.status(400).json(responseTemplate({}, "Email and password is required. See documentation for more info: https://github.com/jjjjcccjjf/joyride-backend-exam"))
        return;
    }
    next();
}

checkDuplicateEmail = async (req, res, next) => {
    const { email } = req.body
    prisma.users.findFirst({
        where: {
            email: email
        }
    }).then(user => {

        if (user) {
            res.status(400).json(responseTemplate({}, "Email is already in use"))
            return;
        }

        next();
    });
};

const verifyRegister = {
    checkRequestBody: checkRequestBody,
    checkDuplicateEmail: checkDuplicateEmail
};

module.exports = verifyRegister;