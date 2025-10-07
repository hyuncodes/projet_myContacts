import 'dotenv/config';
import jwt from "jsonwebtoken";

const access_secretKey = process.env.JWT_SECRET_ACCESS;
const refresh_secretKey = process.env.JWT_SECRET_REFRESH;

export const generateAccessToken = (user) => {
  const payload = { sub: user._id.toString(), email: user.email };
  const accessToken = jwt.sign(payload, access_secretKey, {expiresIn: '10m'});
  return accessToken;
};

export const generateRefreshToken = (user) => {
  const payload = { sub: user._id.toString(), email: user.email };
  const refreshToken = jwt.sign(payload, access_secretKey, {expiresIn: '10m'});
  return refreshToken;
};

export const refreshAccessToken = (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, refresh_secretKey);
    const user= { _id: decoded.sub, email: decoded.email};
    const newAccessToken = generateAccessToken(user);
    return newAccessToken;
  } catch (error) {
    console.error("L'erreur survenue pendant le renouvellement token:", error);
    return null;
  }
};