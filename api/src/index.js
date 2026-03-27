import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import brandsRouter from './routes/brands.js';
import promotionsRouter from './routes/promotions.js';
import usersRouter from './routes/users.js';
import ordersRouter from './routes/orders.js';

app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/brands', brandsRouter);
app.use('/promotions', promotionsRouter);
app.use('/users', usersRouter);
app.use('/orders', ordersRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
