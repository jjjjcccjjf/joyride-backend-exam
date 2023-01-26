const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

checkDuplicateEmail = async (req, res, next) => {
    const { email } = req.body
    prisma.users.findFirst({
        where: {
            email: email
        }
    }).then(user => {
        if (user) {
            res.status(400).send({
                message: "Bad request. Username is already in use!"
            });
            return;
        }

        next();
    });
};

const verifyRegister = {
    checkDuplicateEmail: checkDuplicateEmail,
};

module.exports = verifyRegister;