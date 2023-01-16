class Middlewares {
  checkReqBody(req, res, next) {
    if (req.body) {
      return next();
    }
    return res.status(400).json({
      status: "Fail",
      message: "Invalid Request Body",
    });
  }

  checkID(req, res, next) {
    if (req.params) {
      return next();
    }
    return res.status(400).json({
      status: "Fail",
      message: "Invalid Params",
    });
  }

  checkQuery(req, res, next) {
    if (req.query) {
      return next();
    }
    return res.status(400).json({
      status: "Fail",
      message: "Invalid Query",
    });
  }
}

module.exports = new Middlewares();
