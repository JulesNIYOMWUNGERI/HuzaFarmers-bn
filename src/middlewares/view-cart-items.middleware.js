import jwt from 'jsonwebtoken';

const viewCartItemsMiddleware = async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.USER_SECRET_KEY);
  const userId = decodedToken.id;

  req.userId = userId;

  next();
};
export default viewCartItemsMiddleware;
