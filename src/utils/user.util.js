import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const generateToken = async (data) => {
  const token = jwt.sign(
    { email: data.email, id: data.id },
    process.env.USER_SECRET_KEY,
    {
      expiresIn: process.env.TOKEN_EXPIRATION,
    }
  );
  return token;
};

export const verifyToken = async (token) => {
  const decodedToken = await jwt.verify(token, process.env.USER_SECRET_KEY);
  return decodedToken;
};

export const hashPassword = async (password) => {
  const hashedPassword = bcrypt.hash(password, Number(process.env.BCRYPT_KEY));
  return hashedPassword;
};

export const comparePassword = async (hashedPassword, reqPassword) => {
  const verifyPassword = await bcrypt.compare(hashedPassword, reqPassword);
  return verifyPassword;
};
