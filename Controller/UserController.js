var mongoose = require('mongoose');
const User = require('../Model/usermodel')
const product= require('../Model/Productmodel')
const category = require('../Model/categorymodel')
const banner=require('../Model/bannermodel')
const userotp = require('../Model/userOtpVerification')
const argon2 = require("argon2");
const nodemailer = require('nodemailer');
const userOtpVerification = require('../Model/userOtpVerification');
const session = require('express-session');
require('dotenv').config()

let userRegData
const otp = `${Math.floor(1000 + Math.random() * 90000)}`

const sendmail = async (name,email) => {
    try {

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        })

        const mailoption = {

            from: 'vyshnavkv12345@gmail.com',
            to:email,
            cc: 'vyshnavkvpanalad@gmail.com',
            subject: 'OTP Verification mail',
            text: `hello ${name} your otp ${otp}`
        }


        transporter.sendMail(mailoption, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('email has been set' + info.response);
            }
            return otp
        })

    } catch (error) {
        res.render('users/error')
        console.log(error.message);
    }
}





const loadlogin = async (req, res) => {
    try {
        return res.render('userlogin')
    } catch (error) {
        return res.redirect('/error')
        console.log(error.message);
    }
}

const loadregister = async (req, res) => {
    try {
        return res.render('usersignup', { header: 'userheader', footer: 'userfooter' })
    } catch (error) {
        return  res.redirect('/error')
        console.log(error.message);
    }
}


const insertuser = async (req, res) => {
    try {

        const {name,email} = req.body
        userRegData = req.body
        console.log(userRegData);

        const existUser = await User.findOne({ email: email })
        console.log(existUser)
        if (existUser == null) {

            await sendmail(name, email)

            //  const emailslice = [...email].join('').slice(8)
            return res.redirect('/otpverification')

        }
        else {
            if (existUser.email == email) {
                return res.render('usersignup', { message1: 'User Alredy Exist' })
            }
        }
    }

    catch (error) {
        
        console.log(error.message)
    }
}

const loadverifyotp = async (req, res) => {
    try {
        return res.render('otpverification')
    } catch (error) {
        return res.redirect('/error')
        console.log(error.message);
    }
}


const verifyotp = async (req, res) => {
    try {
        const password = await argon2.hash(userRegData.password);
       

        const enteredotp = req.body.otp;
      


        if (otp == enteredotp) {
            const user = new User({
                name: userRegData.name,
                mobile: userRegData.mobile,
                email: userRegData.email,
                password: password,
                is_blocked: false,
                is_verified: false,
               wallet:  {}
            })
            const userData = await user.save();
            console.log(userData);
            return res.render('usersignup', { message2: "Rgistration successful" })

        }
        else {
            return res.render('otpverification', { message1: "Invalid otp" })

        }



    }
    catch (error) {
       
        console.log(error.message);
        return res.status(500).json({ message: 'Internal server error' });
    }
}



const verifylogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userdata = await User.findOne({ email: email });
        const productdata = await product.find();
        const categories = await category.find();
        console.log(categories);
        console.log(req.body);
        
        if (!userdata) {
            return res.render('userlogin', { message3: 'User does not exist', productdata, categories });
        }

        const passwordMatch = await argon2.verify(userdata.password, password);
        console.log(passwordMatch);
        
        if (!passwordMatch) {
            return res.render('userlogin', { message2: 'Please check your email or password', productdata, categories });
        }

        if (userdata.is_blocked) {
            return res.render('userlogin', { message1: 'Unauthorized Access', productdata, categories });
        }

        req.session.userdata = userdata;
        return res.redirect('/home');
        
    } catch (error) {
        console.log(error.message);
        return res.redirect('/error');
    }
};

const loadhome = async (req, res) => {
    try {
        const data = req.session.userdata
        // console.log(data);
        const categories = await category.find()
        console.log(categories);
        const productdata =await product.find({is_blocked:false}).limit(8)
        const bannerdata=await banner.find()
        
        if (categories) {
            if (data) {

                return res.render('home', { categories: categories, data,productdata,categories,bannerdata})
            } else {
               return  res.render('home', { categories: categories ,productdata,categories,bannerdata})
            }
        } else {
            return res.render('home', { categories: categories,productdata,categories,bannerdata}, { message: 'category doesnot exist' })
        }
    } catch (error) {
         res.redirect('/error')
        console.log(error.message);
    }
}


const logout = async (req, res) => {
    try {
         req.session.destroy(); 
        return res.redirect('/')
    } catch (error) {
        return res.redirect('/error')
        console.log(error.message);
    }
}

let userdata;  //global userdata
const usercontrol = async (req, res) => {
    try {
        const data=req.session.userdata
        const id = req.params.id
        userdata = await User.findOne({ _id: id })
        return res.render('users/userdetails', { userdata,data })
    } catch (error) {
        return res.redirect('/error')
        console.log(error.message);
    }
}

const loaderror=async(req,res)=>{
try {
    return res.render('users/error')
} catch (error) {
    return res.redirect('/error')
    console.log(error.message);
}
}


const edituser = async (req, res) => {
    try {
        const id=req.params.id
        const userdata=await User.findOne({_id:id})
        return res.render('users/edituser', { userdata })

    } catch (error) {
        return res.redirect('/error')
    }
}
const updateuser=async(req,res)=>{
    try {
        const id=req.body.id
        const userdata=await User.findByIdAndUpdate(id,{$set:{
           name: req.body.name,
           mobile:req.body.mobile
        }},{new:true})
        return res.render('users/edituser',{userdata})
    } catch (error) {
        return res.redirect('/error')
    }
}

const loadforgotpassword=async(req,res)=>{
    try {
        return res.render('users/forgotpassword')
        
    } catch (error) {
        console.log(error.message);
    }
}
const loadforgototp=async(req,res)=>{
    try {
        return res.render('users/otpforgotpassword')
    } catch (error) {
        return res.redirect('/error')
    }
}
 let email1
const verifyemail=async(req,res)=>{
    email1=req.body.email
    console.log(email1);
    const exist=await User.find({email:email1})
    try {
        if(exist){
            sendmail(email1)
            res.render('users/otpforgotpassword')
        }else{
            return res.redirect('/forgotpassword')
        }

        
    } catch (error) {
        console.log(error.message);
        return res.render('users/error')
    }
}

const verifyforgototp=async(req,res)=>{
    const forgototp=req.body.otp
    try {
        if(otp==forgototp){
            return res.render('users/resetpassword1')
        }else{
            return res.redirect('/otpforgotpassword',{message:'Entered otp wrong'})
        }
        
    } catch (error) {
        console.log(error.message);
        return res.redirect('/error')
    }
}

const loadresetpassword=async(req,res)=>{
    try {
        return res.render('users/resetpassword1')
        
    } catch (error) {
        return res.redirect('/error')
    }
}
const resetpassword=async(req,res)=>{
    const password = await argon2.hash(req.body.password);
    try {
        const userdata=await User.findOneAndUpdate({
            email:email1
        },{$set:{password:password}},{new:true})
        return res.redirect('/login')
    } catch (error) {
        return res.redirect('/error')
    }
}












    module.exports = {
        loadlogin,
        loadregister,
        insertuser,
        verifyotp,
        verifylogin,
        sendmail,
        loadverifyotp,
        loadhome,
        logout,
        usercontrol,
        edituser,
        loaderror,
        updateuser,
        loadforgotpassword,
        verifyemail,
        loadforgototp,
        verifyforgototp,
        loadresetpassword,
        resetpassword,
       

    }



