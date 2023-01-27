const statusCodes = {
  ERROR: "400",
  NOT_FOUND: "404",
  SERVER_ERROR: "500",
};

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = statusCodes.NOT_FOUND;
  }
}

module.exports = NotFoundError;
