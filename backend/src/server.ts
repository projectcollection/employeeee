import express, { RequestHandler } from 'express';
import bodyParser from 'body-parser';
import cors, { CorsOptionsDelegate } from 'cors';
import { connect } from 'mongoose';
import cookieParser from 'cookie-parser';
import { jwtDecrypt, base64url } from 'jose';

import employeesRouter from './routes/employees.js';
import productsRouter from './routes/products.js';
import authRouter from './routes/auth.js';
import env from './envConfig.js';

const { MONGO_URI, CRYPT_SECRET } = env;

try {
    connect(MONGO_URI);
} catch (error) {
    console.log(error);
}

const port = 3000;

const app = express();

const allowlist = ['http://localhost:3001'];
const corsOptionsDelegate: CorsOptionsDelegate<express.Request> = function(req, callback) {
    let corsOptions = { origin: false };
    const origin = req.header('Origin');

    if (origin && allowlist.indexOf(origin) !== -1) {
        corsOptions = { origin: true };
    }
    callback(null, corsOptions);
};

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

app.use(cors(corsOptionsDelegate));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/employees', employeesRouter);
app.use('/products', jwtMiddleware, productsRouter);
app.use('/auth', authRouter);


app.listen(port, () => {
    console.log(`Server running at port: ${port}`);
})
