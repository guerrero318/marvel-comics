// fn can return a promise and asyncMiddleware will properly wrap it and automatically connect the next callback to properly handle errors.
const asyncMiddleware = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncMiddleware;
