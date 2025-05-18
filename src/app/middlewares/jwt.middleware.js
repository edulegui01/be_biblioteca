import jwt from 'jsonwebtoken';
import 'dotenv/config';



export const verifyToken = (req, res, next) => {

    let token = req.headers.authorization

    if (!token) {
        return res.status(401).json({ error: "Token not provided" });
    }

    token = token.split(" ")[1]

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        console.log('req.user después de decodificar:', req.user);

        next()
    } catch (error) {
        console.log(error)
        return res.status(400).json({ error: "Invalid token" });
    }
}