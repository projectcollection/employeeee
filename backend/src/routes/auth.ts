import express from 'express';
import z from 'zod';
import { model, Schema, connect } from 'mongoose';
import bcrypt from 'bcrypt';
import { EncryptJWT, base64url } from 'jose';

import env from '../envConfig.js';
const { MONGO_URI, CRYPT_SECRET } = env;

try {
    if (MONGO_URI) {
        connect(MONGO_URI);
    } else {
        throw new Error('MONGO_URI undefined');
    }
} catch (error) {
    console.log(error);
}

export const UserSchema = z.object({
    username: z.string(),
    email: z.string(),
    password: z.string()
});

export type UserType = z.infer<typeof UserSchema>;

export const UserMngSchema = new Schema({
    username: String,
    email: String,
    password: String,
});

export const UserModel = model('User', UserMngSchema);

const router = express.Router();

//todo: use real db

//router.get('/', (req, res) => {
//    res.setHeader('content-type', 'application/json');
//    res.statusCode = 200;
//    res.end(JSON.stringify({ message: "success", products: tempProducts }));
//});

router.post('/', async (req, res) => {
    try {
        let newUserData = UserSchema.parse(req.body);
        const { username, email, password } = newUserData;

        const userExists = await UserModel.find({ email });

        if (userExists.length === 0) {
            newUserData.password = await bcrypt.hash(password, 12);
            let newUser = new UserModel(newUserData);
            let jwt;

            if (CRYPT_SECRET) {
                const secret = base64url.decode(CRYPT_SECRET);
                jwt = await new EncryptJWT({
                    username,
                    email
                }).setExpirationTime('2h')
                    .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
                    .encrypt(secret);

            } else {
                throw new Error(`secret undefined`);
            }

            newUser.save();

            res.setHeader('content-type', 'application/json');
            res.statusCode = 200;
            res.cookie('jwt', jwt);
            res.end(JSON.stringify({
                message: "added",
                user: {
                    username,
                    email,
                    jwt
                }
            }));
        } else {
            throw new Error(`user with email: ${newUserData.email} already exists`);
        }


    } catch (error) {

        res.setHeader('content-type', 'application/json');
        res.statusCode = 400;
        res.end(JSON.stringify({ status: "error", message: (error as Error).message }));
    }
});

export default router;
