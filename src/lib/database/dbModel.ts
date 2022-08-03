import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ProductSchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    description: String,
    amount: Number
}, {
    timestamps: true
});

const OrderSchema = new Schema({
    lists: {
        type: [{
            product: { type: Schema.Types.ObjectId, ref: 'Product' },
            product_name: {
                type: String
            },
            amount: {
                type: Number
            },
            type: {
                type: String
            }
        }]
    }
}, {
    timestamps: true
});

const ResultOrderSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    amount: {
        type: Number
    },
    type: {
        type: String
    },
    createdAt: {
        type: Date
    }
});

const ResultOrderModel = mongoose.models.ResultOrderModel || model('ResultOrderModel', ResultOrderSchema);
const ProductModel = mongoose.models.Product || model('Product', ProductSchema, 'Products');
const OrderModel = mongoose.models.Order || model('Order', OrderSchema, 'Orders');

export {
    ProductModel,
    OrderModel,
    ResultOrderModel
}
