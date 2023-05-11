import express from 'express';
import bodyParser from 'body-parser';
import cors, { CorsOptionsDelegate } from 'cors';
import { connect } from 'mongoose';
import cookieParser from 'cookie-parser';

import employeesRouter from './routes/employees.js';
import productsRouter from './routes/products.js';
import authRouter from './routes/auth.js';
import jwtMiddleware from './middlewares/jwt.js';
import env from './envConfig.js';

const { MONGO_URI } = env;

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


app.use(cors(corsOptionsDelegate));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/employees', employeesRouter);
app.use('/products', jwtMiddleware, productsRouter);
app.use('/auth', authRouter);


app.listen(port, () => {
    console.log(`Server running at port: ${port}`);
})
