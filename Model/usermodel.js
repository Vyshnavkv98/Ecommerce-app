
const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema({
    amount: {
      type: Number,
      required: true,
      default:0
    },
    date: {
      type: Date,
      default: Date.now
    }
  });

const WalletSchema = new mongoose.Schema({
    balance: {
      type: Number,
      required: true,
      default:0
    },
    transactions:{
        type:[TransactionSchema],
       
        
    }
  });
  

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    mobile: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },

    is_verified: {
        type: Boolean,
        required: false
    },

    is_blocked: {
        type: Boolean,
        required: false
    },
    address: [{
        name: {
            type: String,
            required: true
        },
        mobile: {
            type: Number,
            required: true
        },
        pincode: {
            type: Number,
            required: true
        },
        locality: { 
            type: String,
            required: true
        },
        address: { 
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: { 
            type:String,
            // required: true
        },
        landmark: {
            type: String,
            required: true
        },
        alternatenumber: {
            type: Number,
            required: true
        }
        }],
    cart: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
        },
        quantity: {
            type: Number,
            default: 1

        }
    }],
    totalbill: {
        type: Number,
        default: 0
    },
    wallet: WalletSchema
})


module.exports = mongoose.model('user', userSchema);