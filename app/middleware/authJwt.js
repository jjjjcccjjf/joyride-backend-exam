const jwt = require("jsonwebtoken");
const responseHelper = require("../helpers/responseHelper")

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
        return res.status(401).json(responseHelper.responseTemplate({}, "Missing authentication token. See documentation for more info: https://github.com/jjjjcccjjf/joyride-backend-exam"));
    }

    jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send(responseHelper.responseTemplate({}, "Illegal token provided. See documentation for more info: https://github.com/jjjjcccjjf/joyride-backend-exam"));
        }
        req.userId = decoded.id;
        next();
    });
};

const authJwt = {
    verifyToken: verifyToken,
};

module.exports = authJwt;