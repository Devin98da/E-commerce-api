const router = require('express').Router();
const CryptoJS = require('crypto-js');
const User = require('../models/user');
const jwt = require('jsonwebtoken');


//REGISTER
router.post('/register', async (req, res, next) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_ENC).toString()
    })

    try {
        const savedUser = await newUser.save();
        res.status(200).send(savedUser);
    } catch (error) {
        res.status(500).send("Server error");
    }
});

//LOGIN
router.post("/login", async (req, res, next) => {
    try {
        const user = await User.findOne({ username: req.body.username });

        if (!user) {
            return res.status(401).send("Cannot find user with this email address");
        }

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_ENC);

        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        if (originalPassword !== req.body.password) {
            return res.status(401).json("Incorrect password");
        }

        const token = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        }, process.env.JWT_SEC, { expiresIn: '3d' });

        const { password, ...others } = user._doc;

        return res.status(200).json({
            token: token,
            user: others
        });

    } catch (error) {
        return res.status(500).send("Server error");
    }
})


module.exports = router; 