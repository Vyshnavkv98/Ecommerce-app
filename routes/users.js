var express = require('express');
var router = express.Router();
const config=require('../Configs/config')
const session=require('express-session')
const UserController=require('../Controller/UserController')
const cartcontroller=require('../Controller/cartcontroller')
const productController=require('../Controller/productcontroller')
const addressController=require('../Controller/addresscontroller')

const {isLogin,isLogout,checkBlocked}=require('../Middleware/userauth');
const { Router } = require('express');
router.use(session({secret:"mysitesessionsecret",resave:true,saveUninitialized:false}));


router.get('/',isLogout,UserController.loadhome)
router.get('/login',isLogout ,UserController.loadlogin)
router.post('/login',UserController.verifylogin)

router.get('/signup',isLogout, UserController.loadregister)
router.post('/signup',UserController.insertuser)

router.get('/forgotpassword',isLogout,UserController.loadforgotpassword)
router.post('/forgotpassword',isLogout,UserController.verifyemail)
router.get('/forgotpassword/otp',isLogout,UserController.loadforgototp)
router.post('/forgotpassword/otp',isLogout,UserController.verifyforgototp)
router.get('/restpassword',isLogout,UserController.loadresetpassword)
router.post('/restpassword',isLogout, UserController.resetpassword)



router.get('/otpverification',isLogout,UserController.loadverifyotp) 
router.post('/otpverification',UserController.verifyotp)

router.get('/home',isLogin,checkBlocked,UserController.loadhome)
router.get('/logout',isLogin,checkBlocked,UserController.logout)

router.get('/shop',isLogin,checkBlocked,productController.loadproductlist)
router.post('/search',productController.serachlist)
router.post('/sortascending',productController.sorta_z)
router.post('/sortdescending',productController.sortz_a)
router.post('/sortpriceascending',productController.sortpriceascending)
router.post('/sortpricedescending',productController.sortpricedescending)

router.get('/productdetails',isLogin,checkBlocked,productController.productdetails)
router.post('/productdetails',isLogin,checkBlocked,cartcontroller.usercart)
router.post('/addtocart',isLogin,checkBlocked,cartcontroller.usercart1)
router.post('/mens',isLogin,checkBlocked,productController.mensproducts)

router.get('/cart',isLogin,checkBlocked,cartcontroller.loadusercart)


router.post('/cartoperation',isLogin,checkBlocked,cartcontroller.cartoperation)


router.get('/deletecart',isLogin,checkBlocked, cartcontroller.deletecart)





router.get('/error',UserController.loaderror)

router.get('/profile/:id',isLogin,checkBlocked, UserController.usercontrol)


router.get('/edit/:id',isLogin,checkBlocked, UserController.edituser)
router.post('/edit',isLogin,checkBlocked, UserController.updateuser)

router.get('/address',isLogin,checkBlocked, addressController.manageaddress)
router.get('/loadaddress',isLogin,checkBlocked, addressController.loadaddress)

router.get('/deleteaddress',isLogin,checkBlocked, addressController.deleteaddress)


router.post('/addaddress',isLogin,checkBlocked, addressController.addAddress)
 router.get('/editaddress',isLogin,checkBlocked,addressController.loadeditaddress)
 router.post('/editaddress',isLogin,checkBlocked,addressController.editaddress)

 router.get('/ordersuccess',isLogin,checkBlocked,cartcontroller.ordersuccess)
router.get('/checkout',isLogin,checkBlocked,cartcontroller.updatecart)
router.post('/checkout',isLogin,checkBlocked,cartcontroller.loadpayment)
//router.post('/checkout/addaddress',isLogin,addressController.checkoutLoadAddress)
router.post('/checkout/addaddress',isLogin,checkBlocked,addressController.checkoutAddAddress)
router.post('/applywallet',isLogin,checkBlocked,cartcontroller.applywallet)

router.get('/orderhistory',isLogin,checkBlocked,cartcontroller.loadorder)
router.get('/orderpending',isLogin,checkBlocked,cartcontroller.loadpending)
router.get('/orderreturn',isLogin,checkBlocked,cartcontroller.loadreturn)
router.get('/orderdelivered',isLogin,checkBlocked,cartcontroller.loaddelivered)
router.get('/ordercancel',isLogin,checkBlocked,cartcontroller.loadcancel)

router.get('/orderdetails',isLogin,checkBlocked,cartcontroller.loadorderdetails)
router.post('/create/orderId',isLogin,checkBlocked,cartcontroller.postorder)
router.post('/api/payment/verify',isLogin,checkBlocked,cartcontroller.paymentverify)
router.get('/orderhistory/details',isLogin,checkBlocked,cartcontroller.loadorderdetails)

router.get('/order/cancel',isLogin,checkBlocked,cartcontroller.cancelorder)
router.get('/order/return',isLogin,checkBlocked,cartcontroller.returnorder)


router.post('/apply-coupon',isLogin,checkBlocked,cartcontroller.applyCoupon)

router.get('/invoice',isLogin,checkBlocked,cartcontroller.invoice)


router.get('/wishlist',isLogin,checkBlocked,cartcontroller.loadwishlist)
router.post('/addwishlist',isLogin,checkBlocked,cartcontroller.addToWishlist)
router.post('/wishlist/delete',isLogin,checkBlocked,cartcontroller.deletewishlist)
router.post('/wishlist/addtocart',isLogin,checkBlocked,cartcontroller.wishlistaddtocart)

router.get('/wallet',isLogin,checkBlocked,cartcontroller.loadwallet)











//router.get('/otpverification',UserController.otpverification)
//router.post('/otpverification',UserController.otpverificationlink)


// router.post('/signup/otpverification',UserController.getbill)




module.exports = router;
