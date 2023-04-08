const mongoose = require('mongoose')
const category=require('../Model/categorymodel')
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema =new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    // image: {
    //     type: String,
    //     required:true
    // },
    image: {
        type: Array,
        required:true
    },
    brand: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    offer:{
        type:Number,
        required:true
    },
   
    is_blocked:{
         type:Boolean,
         default:false,
     },

})
productSchema.plugin(mongoosePaginate);
module.exports= mongoose.model('product',productSchema)