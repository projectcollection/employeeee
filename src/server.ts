import express from 'express';
import bodyParser from 'body-parser';

import employeesRouter from './routes/employees.js';
import productsRouter from './routes/products.js';

const port = 3000;

const app = express();

app.use(bodyParser.json());

app.use('/employees', employeesRouter);
app.use('/products', productsRouter);

app.listen(port, () => {
    console.log(`Server running at port: ${port}`);
})
