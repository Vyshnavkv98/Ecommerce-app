const mongoose = require('mongoose');
const Category = require('../Model/categorymodel')



const listcategory = async (req, res) => {
    try {
        const categorydata = await Category.find()
        res.render('category/listcategory', { categorylist: categorydata })
    } catch (error) {
        console.log(error.message);
    }
}

const loadaddcategory = async (req, res) => {
    try {
        res.render('category/addcategory')
    } catch (error) {
        console.log(error.message);
    }
}

const addcategory = async (req, res) => {
    try {
        if (Object.values(req.body).some(value => !value.trim() || value.trim().length === 0)) {
            res.render('category/addcategory', { message: 'please fill the field'})

        } else {
        const firstlettercap=(str)=>{
            return str.charAt(0).toUpperCase()+str.slice(1).toLowerCase()
        }
        const name = firstlettercap(req.body.name)
        const categorydata = await Category.findOne({ name: name })
        if (categorydata) {
            res.render('category/addcategory', { message1: 'Category already exist' })
        } else {
            if(name==''){

                res.render('category/addcategory', { message: 'failed' })
            
        }else{
            const category = new Category({
                name: name,
                image: req.file.filename
            })

            const categorydata = category.save()
            res.render('category/addcategory', { message: 'Category added successfully' })
        }
    }
}

    } catch (error) {
        console.log(error.message);
    }
}

const deletecategory = async (req,res) => {
    try {

        const _id = req.body.id
        console.log(_id);
        await Category.findByIdAndDelete(_id)
        res.json("done")
        }
         catch (error) {
        console.log(error.message);
    }
}

const loadeditcategory = async (req, res) => {
    try {
        const id = req.query.id
        const categorydata = await Category.findById({ _id: id })
        console.log(categorydata.name);
        if (categorydata) {
            res.render('category/editcategory.hbs', { category: categorydata })

        } else {
            res.redirect('/admin/category')
        }
    } catch (error) {
        console.log(error.message);
    }
}


const editcategory = async (req, res) => {
    try {
        const firstlettercap=(str)=>{
            return str.charAt(0).toUpperCase()+str.slice(1).toLowerCase()
        }
        const name = firstlettercap(req.body.name)
        const categ=await Category.findOne({name:name})
        if(!categ){
        const categorydata = await Category.findByIdAndUpdate(
            req.body.id, {
                $set:
                {
                    name:name,
                    image: req.file.filename,
                }
        }, { new: true }

        )
        res.render('category/editcategory',{message:'Edited successfully'})
        console.log(categorydata);
    }else{
        res.redirect(`/admin/editcategory?id=${req.body.id}`)
    }
        

    } catch (error) {
        console.log(error.message);
    }
}



module.exports = {
    listcategory,
    loadaddcategory,
    addcategory,
    deletecategory,
    loadeditcategory,
    editcategory
}
