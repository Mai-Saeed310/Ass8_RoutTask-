import jwt from "jsonwebtoken";

// middleware func to get the token from the header 
export const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "token required" });
    }

    const decoded = jwt.verify(token, "Eng.Mai");
    req.userId = decoded.userId;

    next();
  } catch (error) {
    res.status(401).json({ message: "invalid token" });
  }
};
