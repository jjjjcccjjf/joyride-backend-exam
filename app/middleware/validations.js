
checkMaxTenLogins = async (req, res, next) => {
    const { login } = req.body;

    if (login.length > 10) {
        res.status(400).send({
            message: "Bad request. Users cannot exceed 10"
        });
        
        return;
    }

    next();
}

const validations = {
    checkMaxTenLogins: checkMaxTenLogins
}

module.exports = validations;