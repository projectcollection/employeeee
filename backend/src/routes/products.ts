import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import z from 'zod';
import { model, Schema } from 'mongoose';

export const ImageSchema = z.object({
    thumbnail: z.string(),
    original: z.string()
});

export const ImageMngSchema = new Schema({
    thumbnail: String,
    original: String
});

export type Image = z.infer<typeof ImageSchema>;

export const AttributeSchema = z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string()
});

export const AttributeMngSchema = new Schema({
    id: String,
    name: String,
    slug: String
});

export type Attribute = z.infer<typeof AttributeSchema>;

export const VariationSchema = z.object({
    id: z.number(),
    value: z.string(),
    attribute: AttributeSchema
});

export const VariationMngSchema = new Schema({
    id: String,
    attribute: AttributeMngSchema
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


export const ProductMngSchema = new Schema({
    name: { type: String, unique: true },
    description: String,
    slug: String,
    image: ImageMngSchema,
    gallery: [ImageMngSchema],
    price: Number,
    sale_price: Number,
    variations: [VariationMngSchema]
});

//Indexing isn't supported on the free tier
ProductMngSchema.path('name').index({ unique: true });

const ProductModel = model('Product', ProductMngSchema);

const router = express.Router();

//todo: use real db
let tempProducts: Product[] = [];

router.get('/', async (req, res) => {
    const products = await ProductModel.find();
    res.setHeader('content-type', 'application/json');
    res.statusCode = 200;
    res.json({ message: "success", products });
});

router.post('/', (req, res) => {
    try {
        let newProduct = ProductSchema.partial({ id: true }).parse(req.body);

        let product = new ProductModel(newProduct);

        // todo: check if product already exist
        product.save();

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
