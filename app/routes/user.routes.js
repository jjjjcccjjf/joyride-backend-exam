const { authJwt, validations, caching } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.post(
        "/api/list",
        [authJwt.verifyToken, validations.checkReqBody, validations.checkMaxTenLogins, caching.redisLookup],
        controller.list
    );
};