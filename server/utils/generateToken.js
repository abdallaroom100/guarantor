
import jwt from "jsonwebtoken";


const generateToken = (adminId, res,req) => {
  const token = jwt.sign({ adminId },"secret");
  req.token = token
  res.setHeader('Authorization',`Bearer ${token}`)
  res.status(200)
};

export default generateToken;
 