const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const UserRoute = require('./routes/user');
const AuthRoute = require('./routes/auth');
const ProductsRoute = require('./routes/product');
const OrdersRoute = require('./routes/order');
const CartRoute = require('./routes/cart');

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect("mongodb+srv://devinda:cC0oEaEBUHsDsTar@cluster0.awb49.mongodb.net/e-commerce-shop")
    .then(()=>{
        console.log("Database connection succesfully");
    })
    .catch((err)=>{
        console.log(err);
    })

app.listen(process.env.PORT || 5000, () => {
    console.log('backend service is running');
})

app.use('/api/user', UserRoute);
app.use('/api/auth', AuthRoute);
app.use('/api/products', ProductsRoute);
app.use('/api/orders', OrdersRoute);
app.use('/api/cart', CartRoute);