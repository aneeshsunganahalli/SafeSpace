import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = decodedToken.id;
    next();

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
    
  }
}

export default verifyToken;