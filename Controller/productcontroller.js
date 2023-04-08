
var mongoose = require('mongoose');
const product = require('../Model/Productmodel')
const user = require('../Model/usermodel')
const category = require('../Model/categorymodel');
const { findById } = require('../Model/usermodel');
const mongoosePaginate = require('mongoose-paginate-v2');



const loadproduct = async (req, res) => {
    try {
        console.log('product');
        const productdata = await product.find()
        res.render('product', { products: productdata })
    } catch (error) {
        console.log(error.message);
    }
}

const loadaddproduct = async (req, res) => {
    try {
        const categorydata = await category.find()
        res.render('addproduct', { categorydata })
    } catch (error) {
        console.log(error.message);
    }
}



const addproduct = async (req, res) => {
    try {
        const productdescription = req.body.description
        const arrayimg = productdescription.image
        console.log(req.body.description);
        const images = []
        const file = req.files
        file.forEach(element => {
            const image = element.filename
            images.push(image)
        });

        const productdata = await product.findOne({ description: productdescription })
        const offerprice = (req.body.price) - (req.body.price) * (req.body.offer) / 100
        console.log(offerprice);
        if (productdata) {
            res.render('addproduct', { message: 'product already exist' })
        } else {
            const Products = new product({
                name: req.body.name,
                description: req.body.description,
                image: images,
                brand: req.body.brand,
                price: req.body.price,
                category: req.body.category,
                quantity: req.body.quantity,
                offer: req.body.offer,
                offerprice: offerprice,

                is_blocked: false,
            })
            const productdata = await Products.save()
            console.log((productdata));
            res.render('addproduct', { message: 'Product added successfully' })
        }
    } catch (error) {
        console.log(error.message);
    }
}

const loadupdateproduct = async (req, res) => {
    try {
        const id = req.query.id;
        const productdata = await product.findById({ _id: id })
        const images = productdata.image
        const imagefile = images.map((item) => {
            return item
        })
        console.log(imagefile);
        res.render('updateproduct', { products: productdata, images: imagefile })

    } catch (error) {
        console.log(error.message);
    }
}


const updateproduct = async (req, res) => {
    try {



        console.log(req.body.id);
        if (req.fileValidationError) {
            res.render('updateproduct', { error: req.fileValidationError });
        }


        const prodata = await product.findOne({ _id: req.body.id })
        const exImage = prodata.imageUrl
        const files = req.files

       
        let updImages = []
        files.forEach(element => {
            const image = element.filename
            updImages.push(image)
        });
        const offerprice = (req.body.price) - (req.body.price) * (req.body.offer) / 100
        if (files && files.length > 0) {

            product.imageUrl = updImages
        } else {
            updImages = exImage
        }

        const productdata = await product.findByIdAndUpdate({ _id: req.body.id },
            {
                $set:
                {
                    name: req.body.name,
                    description: req.body.description,
                    image: updImages,
                    brand: req.body.brand,
                    price: req.body.price,
                    quantity: req.body.quantity,
                    offer: req.body.offer,
                    offerprice: offerprice,
                }
            }, { new: true }

        )
        res.redirect('/admin/product')
        console.log(productdata);
        if (!productdata) {
            res.render("updateproduct", { message1: 'Cannot find the product' })
        }

    } catch (error) {
        console.log(error.message);
    }
}
const blockproduct = async (req, res) => {
    const data = await product.findById(req.params.id)
    const blockstatus = data.is_blocked
    try {
        const productdata = await product.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    is_blocked: !blockstatus,
                }
            }, { new: true }

        )
        res.redirect('/admin/product')


    } catch (error) {
        console.log(error.message);
    }
}

const loadproductlist = async (req, res) => {
    try {
        const data = req.session.userdata;
        const categorydata = await category.find();

        const options = {
            page: req.query.page || 1, // get current page number from query params
            limit: 8,
            query: { is_blocked: true }
        };

        let result;
        const selectedCategoryId = req.body.categoryid;

        if (selectedCategoryId) {
            result = await product.paginate(
                { category: selectedCategoryId, is_blocked: false },
                options
            );
        } else {
            result = await product.paginate({ is_blocked: false }, options);
        }

        res.render('users/productlist', { productdata: result, data, categorydata });
    } catch (error) {
        console.log(error.message);
    }
}
const sortProducts = async (sortQuery, category, searchTerm) => {
   
    if (searchTerm) {
        let query = {};
        if (searchTerm) {
        query = { category };
        }
        const searchcontent = (searchTerm).charAt(0).toUpperCase() + (searchTerm).slice(1).toLowerCase();
        console.log(searchcontent);
        productdata = await product.find({ "name": { $regex: new RegExp(`^${searchcontent}`) }, category: category,is_blocked: false }).sort(sortQuery);
        return productdata;

    } else {
     let query = {is_blocked: false};
        if (category) {
            query = { category,is_blocked: false };
        }
        const productdata = await product.find(query).sort(sortQuery);
        return productdata;
    }
}


const serachlist = async (req, res) => {
    try {
        const categoryid = req.body.categoryid;
        console.log(categoryid);
        const searchcontent = (req.body.searchTerm).charAt(0).toUpperCase() + (req.body.searchTerm).slice(1).toLowerCase();
        console.log(searchcontent);
        let productdata;
        if (categoryid) {
            productdata = await product.find({ "name": { $regex: new RegExp(`^${searchcontent}`) }, category: categoryid,is_blocked: false });
        } else {
            productdata = await product.find({ "name": { $regex: new RegExp(`^${searchcontent}`) },is_blocked: false });
        }
        console.log(productdata);
        res.json({ productdata: productdata });
    } catch (error) {
        console.log(error.message);
    }
}



const sorta_z = async (req, res) => {
    try {
        const categoryid = req.body.categoryid
        const category = categoryid
        const searchTerm=req.body.searchTerm
        const searchcontent = (req.body.searchTerm).charAt(0).toUpperCase() + (req.body.searchTerm).slice(1).toLowerCase();
        const sortQuery = { name: 1 };
        const productdata = await sortProducts(sortQuery, category,searchTerm);
        res.json({ productdata });
    } catch (error) {
        console.log(error.message);
    }
}

const sortz_a = async (req, res) => {
    try {
        const categoryid = req.body.categoryid
        const searchTerm=req.body.searchTerm
        const searchcontent = (req.body.searchTerm).charAt(0).toUpperCase() + (req.body.searchTerm).slice(1).toLowerCase();
        const category = categoryid
        const sortQuery = { name: -1 };
        const productdata = await sortProducts(sortQuery, category, searchTerm);
        res.json({ productdata });
    } catch (error) {
        console.log(error.message);
    }
}

const sortpriceascending = async (req, res) => {
    try {
        const categoryid = req.body.categoryid
        const searchTerm=req.body.searchTerm
        const searchcontent = (req.body.searchTerm).charAt(0).toUpperCase() + (req.body.searchTerm).slice(1).toLowerCase();
        const category = categoryid
        const sortQuery = { price: 1 };
        const productdata = await sortProducts(sortQuery, category, searchTerm);
        console.log(productdata,'from ascending');
        res.json({ productdata });
    } catch (error) {
        console.log(error.message);
    }
}

const sortpricedescending = async (req, res) => {
    try {
        const categoryid = req.body.categoryid
        console.log(categoryid);
        const searchTerm=req.body.searchTerm
        const searchcontent = (req.body.searchTerm).charAt(0).toUpperCase() + (req.body.searchTerm).slice(1).toLowerCase();
        const category = categoryid
        const sortQuery = { price: -1 };
        const productdata = await sortProducts(sortQuery, category, searchTerm);
        console.log(productdata,'from descending',281);
        res.json({ productdata });
    } catch (error) {
        console.log(error.message);
    }
}


const productdetails = async (req, res) => {
    try {
        const data = req.session.userdata;
        console.log(data);
        const id = req.query.id
        const userdata = req.session.userdata
        console.log(id, 'productdetails');

        const productdata = await product.findById(id)
        const cartdata = await user.findOne({ _id: data._id, "cart.product": id })
        if (cartdata) {
            console.log('true');
        } else {
            console.log('false');
        }
        res.render('users/productdetails', { data: data, productdata: productdata, iscartdata: cartdata })

    } catch (error) {
        console.log(error.message);
    }
}



const mensproducts = async (req, res) => {
    try {
        const data = req.session.userdata;
        const categoryid = req.body.id;
        const categories = await category.find();
        const productdata = await product.find({ is_blocked: false });
        const mensdata = await product.find({
            category: categoryid,
            is_blocked: false,
            productdata
        });
        res.json({ mensdata: mensdata, data: data, categories, categoryid });
    } catch (error) {
        console.log(error.message);
    }
}

const loadcheckout = async (req, res) => {
    try {
        const data = req.session.userdata;
        res.render('users/checkout', { data })
    } catch (error) {
        console.log(error.message);
    }
}
module.exports = {
    loadproduct,
    loadaddproduct,
    addproduct,
    loadupdateproduct,
    updateproduct,
    blockproduct,
    productdetails,
    loadproductlist,
    mensproducts,
    serachlist,
    sorta_z,
    sortz_a,
    sortpriceascending,
    sortpricedescending
    // loadcheckout
}