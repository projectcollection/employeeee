import dotenv from 'dotenv';
import z from 'zod';
dotenv.config();

const ENVSchema = z.object({
    MONGO_URI: z.string(),
    CRYPT_SECRET: z.string()
});

export default ENVSchema.parse(process.env);
