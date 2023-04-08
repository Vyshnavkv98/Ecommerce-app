
const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    // Image: [{
    //     type:String
    // }]
})

module.exports = mongoose.model('category', categorySchema)