const { verifyTokenAndAutherization, verifyTokenAndAdmin, verifyToken } = require('../middleware/verifyToken');
const Order = require('../models/Order');

const router = require('express').Router();

//CREATE Order
router.post('/create', verifyToken, async (req, res, next) => {
    const newOrder = new Order(req.body);
    console.log(newOrder)
    try {
        const createdOrder = await newOrder.save();
        res.status(200).json(createdOrder);
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
})

// UPDATE Order
router.put("/update/:id", verifyTokenAndAdmin, async (req, res) => {

    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });

        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(410).json(error);
    }
});

//DELETE Order
router.delete("/delete/:id", verifyTokenAndAdmin, async (req, res, next) => {
    try {
        await Order.deleteOne({ id: req.params.id });
        res.status(200).json("Order has been deleted succesfully");
    } catch (error) {
        res.status(500).json(error);
    }
});

//GET Order
router.get("/find/:userId", verifyTokenAndAutherization, async (req, res, next) => {
    try {
        const orders = await Order.find({ userId: req.params.userId });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json(error);
    }
});

//GET All Orders
router.get("/find/", verifyTokenAndAdmin, async (req, res, next) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json(error);
    }
});

// GET MONTHLY INCOME
router.get('/income', verifyTokenAndAdmin, async (req, res, next) => {
    const productId = req.body.pId;
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth },
                ...(productId && {
                    products:{$eleMatch:{productId}}
                })
            } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" },
                },
            },
        ]);
        res.status(200).json(income);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router; 