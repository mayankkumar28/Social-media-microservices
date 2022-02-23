const {
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} = require("./verifyToken");

const setupAuth = (app, routes) => {
  routes.forEach((route) => {
    if (route.auth === "admin") {
      app.use(route.url, verifyTokenAndAdmin, (req, res, next) => {
        next();
      });
    } else if (route.auth) {
      app.use(route.url, verifyTokenAndAuthorization, (req, res, next) => {
        next();
      });
    }
  });
};

exports.setupAuth = setupAuth;
