import jwt from "jsonwebtoken";

const accessSecret = process.env.JWT_SECRET_ACCESS;
const refreshSecret = process.env.JWT_SECRET_REFRESH;

export function authJWT(req, res, next) {
  const headerToken = req.headers?.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(' ')[1] : undefined;

  const accessToken = headerToken || req.cookies?.accessToken;
  const refreshToken = req.cookies?.refreshToken;

  let payload;

  if (accessToken) {
    try {
      payload = jwt.verify(accessToken, accessSecret);
    } catch (err) {
      if (err.name !== "TokenExpiredError") {
        return res.status(401).json({error: "Accès refusé"});
      }
    }
  }

  if (!payload) {
    if (!refreshToken) {
      return res.status(401).json({error: "Accès refusé"});
    }
    try {
      const decodedRefresh = jwt.verify(refreshToken, refreshSecret);

      const newAccessToken = jwt.sign(
          {sub: decodedRefresh.sub, email: decodedRefresh.email},
          accessSecret,
          {expiresIn: "10m"}
      );

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 10 * 60 * 1000,
      });

      payload = decodedRefresh;
    } catch {
      return res.status(401).json({error: "Accès refusé"});
    }
  }

  const sub = payload?.sub;
  if (sub == null) return res.status(401).json({error: "Accès refusé"});

  req.currentUserId = typeof sub === "string" ? sub : String(sub);
  req.currentEmail = payload.email ?? null;

  return next();
}


