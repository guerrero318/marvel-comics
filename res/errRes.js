// Constructor that lets us do custom error handling by extending the Error Class provided by Javascript
// All it needs passed in is a status code for the customized error and an error message
class ErrRes extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ErrRes;
