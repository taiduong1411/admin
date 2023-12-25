import jwt from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';
export const adminRole = async (req, res, next) => {
    const token = req.headers['authorization'];
    const token_decode = jwtDecode(token);
    await jwt.verify(token, process.env.JWT_KEY, function (err) {
        if (err) {
            // console.log(err);
            return res.status(401).send('err')
        }
        else {
            if (token_decode.isAdmin != true) {
                return res.status(404).json({ success: false, msg: 'you are not admin' })
            } else {
                next();
            }
        }
    })
}