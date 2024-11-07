const { sendConfirmationEmail } = require('../emailservice');
const Subscriber = require('../models/Subscriber');

const router = require('express').Router();

router.post('/subscribe', async (req, res, next) => {
    const email = req.body.email;

    if (!email && !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({
            message: "Invalid email address"
        })
    }

    try {
        const newSubscriber = new Subscriber({ email });

        await newSubscriber.save();
        await sendConfirmationEmail(email);

        res.status(201).json({ message: 'Subscription successful! Confirmation email sent.' });

    } catch (error) {
        if (error.code === 11000) { // Duplicate key error code
            res.status(400).json({ message: 'This email is already subscribed.' });
        } else {
            res.status(500).json({ message: 'Server error. Please try again later.' });
        }
    }
})

router.post('/unsubscribe', async (req, res, next) => {
    
})

module.exports = router;