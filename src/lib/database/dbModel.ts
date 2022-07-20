import mongoose from 'mongoose';

const {Schema, model} = mongoose;

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
            product: {type: Schema.Types.ObjectId, ref: 'Product'},
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

const ProductModel = mongoose.models.Product || model('Product', ProductSchema);
const OrderModel = mongoose.models.Order || model('Order', OrderSchema);

export {
    ProductModel,
    OrderModel
}
