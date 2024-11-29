const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title: {
        type: String, required: true, unique: true
    },
    description: {
        type: String, required: true
    },
    image: {
        type: String, required: true
    },
    categories: {
        type: Array, required: true
    },
    size: {
        type: Array
    },
    color: {
        type: Array
    },
    price: {
        type: Number, required: true
    },
    promotion: {
        type: Number,
        default: 0
    },
    inStock: { type: Boolean, default: true }


}, { timestamps: true });

ProductSchema.virtual('discountPrice').get(function() {
    if (this.promotion > 0) {
        return this.price * (1 - this.promotion / 100);
    }
    return this.price;
});

ProductSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', ProductSchema);



