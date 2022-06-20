import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'].replace('Bearer ', '');

  if (!token) {
    return res.status(403).send('A user token is required for authentication');
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorised User' });
  }
  return next();
};

export default verifyToken;
