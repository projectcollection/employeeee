import express from 'express';
import { v4 as uuidv4 } from 'uuid';

//todo: use zod for types/validation
export type Image = {
    thumbnail: string,
    original: string
};

export type Attribute = {
    id: number,
    name: string,
    slug: string
}

export type Variations = {
    id: number,
    value: string,
    attribute: Attribute
};

export type Product = {
    id: string,
    name: string,
    description: string,
    slug: string,
    image: Image,
    gallery: Image[],
    price: number,
    sale_price: number,
    variations: Variations[]
}

const router = express.Router();

//todo: use real db
let tempProducts: Product[] = [];

router.get('/', (req, res) => {
    res.setHeader('content-type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({ message: "success", products: tempProducts }));
});

router.post('/', (req, res) => {
    //todo: need validation
    let newProduct = req.body;
    newProduct.id = uuidv4();

    tempProducts.push(newProduct as Product);

    res.setHeader('content-type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({ message: "added", product: newProduct }));
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
