import dotenv from 'dotenv';
dotenv.config();

const { MONGO_URI, CRYPT_SECRET } = process.env;

export default {
    MONGO_URI,
    CRYPT_SECRET
};
