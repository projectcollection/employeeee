import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import z from 'zod';

export const ImageSchema = z.object({
    thumbnail: z.string(),
    original: z.string()
});

export type Image = z.infer<typeof ImageSchema>;


export const AttributeSchema = z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string()
});

export type Attribute = z.infer<typeof AttributeSchema>;

export const VariationSchema = z.object({
    id: z.number(),
    value: z.string(),
    attribute: AttributeSchema
});

export type Variation = z.infer<typeof VariationSchema>;

export const ProductSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    slug: z.string(),
    image: ImageSchema,
    gallery: z.array(ImageSchema),
    price: z.number(),
    sale_price: z.number(),
    variations: z.array(VariationSchema)
});

export type Product = z.infer<typeof ProductSchema>;

const router = express.Router();

//todo: use real db
let tempProducts: Product[] = [];

router.get('/', (req, res) => {
    res.setHeader('content-type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({ message: "success", products: tempProducts }));
});

router.post('/', (req, res) => {
    try {
        let newProduct = ProductSchema.partial({ id: true }).parse(req.body);
        newProduct.id = uuidv4();

        tempProducts.push(newProduct as Product);

        res.setHeader('content-type', 'application/json');
        res.statusCode = 200;
        res.end(JSON.stringify({ message: "added", product: newProduct }));
    } catch (error) {

        res.setHeader('content-type', 'application/json');
        res.statusCode = 400;
        res.end(JSON.stringify({ message: "error", error }));
    }
});

router.delete('/', (req, res) => {
    try {
        if (req.body.id) {
            tempProducts.filter(prod => {
                return prod.id != req.body.id;
            });

            res.setHeader('content-type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({ message: "deleted" }));
        }

    } catch (err) {
        res.setHeader('content-type', 'application/json');
        res.statusCode = 404;
        res.end(JSON.stringify({ message: "not found" }));
    }
});

export default router;
