const { verifyTokenAndAutherization, verifyTokenAndAdmin } = require('../middleware/verifyToken');
const User = require('../models/user');
const CryptoJS = require('crypto-js');

const router = require('express').Router();

// UPDATE
router.put("/update/:id", verifyTokenAndAutherization, async (req, res) => {
    req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_ENC).toString();

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(410).json("");
        console.log(error)
    }
});

//DELETE
router.delete("/delete/:id", verifyTokenAndAutherization, async (req, res, next) => {
    try {
        await User.deleteOne({ id: req.params.id });
        res.status(200).json("User has been deleted succesfully");
    } catch (error) {
        res.status(500).json(error);
    }
});

//GET
router.get("/find/:id", verifyTokenAndAdmin, async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.params.id });
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (error) {
        res.status(500).json(error);
    }
});

//GET ALL
router.get("/findall", verifyTokenAndAdmin, async (req, res, next) => {
    const query = req.query.new;

    try {
        const users = query ? await User.find().sort({ _id: -1 }).limit(1) : await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
});

//GET STATISTICS
router.get("/stats", verifyTokenAndAdmin, async (req, res, next) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(new Date(date.getFullYear() - 1)));

    try {
        const data = await User.aggregate([
            {
                $match: { createdAt: { $gte: lastYear } }
            },
            {
                $project: {
                    month: { $month: "$createdAt" }
                }
            },
            {
                $group: {
                    _id: "month",
                    total: { $sum: 1 }
                }
            }
        ]);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router; 