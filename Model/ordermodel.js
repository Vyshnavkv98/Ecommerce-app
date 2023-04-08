const mongoose = require('mongoose');
const Schema = mongoose.Schema



const orderSchema = new Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
        required: true
    },
    address: {
        name: String,
        mobile: Number,
        pincode: Number,
        locality: String,
        address: String,
        city: String,
        state: String,
        landmark: String,
        alternatenumber: Number,
        //  type:mongoose.Schema.Types.ObjectId,
        //  required:true
    },
    items: [{

        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',

        },
        quantity: { type: Number, min: 1 },
        bill:{type:Number},


    }],
    totalbill: { type: String },

    orderstatus: {
        type: String,
        enum: [
            'pending',
            'shipped',
            'delivered',
            'canceled',
            'return'
        ],
        default: 'pending',
    },
    paymentmode: {
        type: String
    },
    orderdate: {
        type: Date,
        
    },
    orderid:{
        type:String,
    },
    walletapplied:{
        type:Number,
        default:0
    },
    subtotal:{
        type:Number,
        default:0
    }

}, { timestamps: true })

module.exports = mongoose.model('order', orderSchema);