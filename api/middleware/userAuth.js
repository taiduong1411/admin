import jwt from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';
export const userRole = async (req, res, next) => {
    const token = req.headers['authorization'];
    // const token_decode = jwtDecode(token);
    await jwt.verify(token, process.env.JWT_KEY, function (err) {
        if (err) {
            // console.log(err);
            return res.status(401).send('err')
        }
        else {
            next();
        }
    })
}