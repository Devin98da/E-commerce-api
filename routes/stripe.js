const router = require('express').Router();
const stripe = require('stripe')("sk_test_51KqiRCKhjZiDhPCgLirX22jgDJ6q7xwhMK2D3CZWLI6f01MYONNDNUTbSdgE2YwsvNLXcRM4wJtKcnbF3MeZ9QOy00EIU1PM2Z");

router.post('/payment', (req, res, next) => {
    stripe.charges.create({
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: "usd"
    }, (stripeErr, stripeRes) => {
        if (stripeErr) {
            res.status(500).json(stripeErr);
            console.log(stripeErr)
        } else {
            res.status(200).json(stripeRes);
        } 
    })
})

module.exports = router;