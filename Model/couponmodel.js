const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  discount: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  minbill:{
    type:Number
  },
  status:{
    type:String

  },
  useduser:[{
     type:mongoose.Schema.Types.ObjectId,
     ref:'user'
}]
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;