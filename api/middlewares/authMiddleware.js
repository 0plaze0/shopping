import jwt from "jsonwebtoken";

export const requireSignIn = async (req, res, next) => {
  try {
    const decode = await jwt.verify(
      req.headers.authorization,
      process.env.ACCESS_TOKEN
    );
    console.log(decode);
    req.user = decode;
    next();
  } catch (err) {
    console.log(err);
  }
};
