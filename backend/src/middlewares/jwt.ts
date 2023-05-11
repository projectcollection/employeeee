import { RequestHandler } from 'express';
import { jwtDecrypt, base64url } from 'jose';

import env from '../envConfig.js';

const { CRYPT_SECRET } = env;

const jwtMiddleware: RequestHandler = async (req, res, next) => {
    const { jwt } = req.cookies;

    if (jwt) {
        const secret = base64url.decode(CRYPT_SECRET);
        const { payload, protectedHeader } = await jwtDecrypt(jwt, secret);

        const { username, email, exp } = payload;

        //todo: do something with the payload? check if user is allowed?

        // jwt exp is SECONDS after epoch, js uses milliseconds
        if (exp && exp * 1000 < Date.now()) {
            res.clearCookie('jwt');
            res.json({ status: 'error', message: 'jwt expired' });
        } else {
            next();
        }
    } else {
        res.statusCode = 403;
        res.json({ status: "error", message: "missing jwtToken" });
    }
}

export default jwtMiddleware;
