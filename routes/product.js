const { verifyTokenAndAutherization, verifyTokenAndAdmin } = require('../middleware/verifyToken');
const Product = require('../models/Product');

const router = require('express').Router();

//CREATE PRODUCT
router.post('/create', verifyTokenAndAdmin, async (req, res, next) => {
    const newProduct = new Product(req.body);
    console.log(req.body)
    try {
        const createdProcut = await newProduct.save();
        res.status(200).json(createdProcut);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
})

// UPDATE PRODUCT
router.put("/update/:id", verifyTokenAndAdmin, async (req, res) => {
    console.log("Body " + req.body)

    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(410).json(error);
        console.log(error)
    }
});

//DELETE PRODUCT
router.delete("/delete/:id", verifyTokenAndAdmin, async (req, res, next) => {
    try {
        await Product.deleteOne({ _id: req.params.id });
        const products = await Product.find();
        res.status(200).json({
            message: "Product has been deleted succesfully",
            products: products
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

//GET PRODUCT
router.get("/find/:id", async (req, res, next) => {
    try {
        const product = await Product.findOne({ _id: req.params.id });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json(error);
        console.log(error)
    }
});

//GET ALL PRODUCT
router.get("/", async (req, res, next) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;

    try {
        let products;

        if (qNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(5);
        } else if (qCategory) {
            products = await Product.find({
                categories: {
                    $in: [qCategory]
                }
            });
        } else {
            products = await Product.find();
        }
        res.status(200).json(products);

    } catch (error) {
        res.status(500).json(error);
    }
});

//SEARCH
router.post('/search', async (req, res, next) => {
    try {
        
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router; 