import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const token = req.headers.adminkey;

  if (!token) {
    return res
      .status(403)
      .send('An admin token is required for authentication');
  }
  try {
    const decoded = jwt.verify(token, process.env.ADMIN_TOKEN_KEY);
    req.admin = decoded;
  } catch (err) {
    return res.status(401).send('Unauthorised Admin');
  }
  return next();
};

export default verifyToken;
