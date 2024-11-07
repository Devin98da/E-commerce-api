const mongoose = require('mongoose');

const SubscriberScheme = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    type: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Subscriber', SubscriberScheme);