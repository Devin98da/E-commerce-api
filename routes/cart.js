const { verifyTokenAndAutherization, verifyTokenAndAdmin, verifyToken } = require('../middleware/verifyToken');
const Cart = require('../models/Order');

const router = require('express').Router();

//CREATE Cart
router.post('/create', verifyToken, async (req, res, next) => {
    const newCart = new Cart(req.body);

    try {
        const createdCart = await newCart.save();
        res.status(200).json(createdCart);
    } catch (error) {
        res.status(500).json(error);
    }
})

// UPDATE Cart
router.put("/update/:id", verifyTokenAndAutherization, async (req, res) => {

    try {
        const updatedCart = await Cart.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });

        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(410).json(error);
    }
});

//DELETE Cart
router.delete("/delete/:id", verifyTokenAndAutherization, async (req, res, next) => {
    try {
        await Cart.deleteOne({ id: req.params.id });
        res.status(200).json("Cart has been deleted succesfully");
    } catch (error) {
        res.status(500).json(error);
    }
});

//GET Cart
router.get("find/:userId", verifyTokenAndAutherization, async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json(error);
    }
});

//GET All Cart
router.get("find/", verifyTokenAndAdmin, async (req, res, next) => {
    try {
        const carts = await Cart.find();
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router; 