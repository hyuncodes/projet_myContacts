import { authService } from "../services/auth.service.js";

export async function register(req, res, next) {
  try {
    const {email, password} = req.body;

    console.log(email);
    console.log(password);
    const result= await authService.register({email, password});
    return res.status(201).json({result});
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const {email, password} = req.body;
    const {user, accessToken, refreshToken} = await authService.login({email, password});

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 10 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({user});
  } catch (err) {
   next(err);
  }
}