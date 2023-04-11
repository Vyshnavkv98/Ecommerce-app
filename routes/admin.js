var express = require('express');
var router = express.Router();
const adminController=require('../Controller/AdminController')
const productController=require('../Controller/productcontroller')
const cartcontroller=require('../Controller/cartcontroller')
const userController=require('../Controller/UserController')
const categoryController=require('../Controller/categorycontroller')
const bannerController=require('../Controller/bannercontroller')
const cartController=require('../Controller/cartcontroller')
const session=require('express-session')
const config=require('../Configs/config')
const adminauth=require('../Middleware/adminauth')
const multer=require('multer')
const path=require('path')
const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images'));
  },
  filename: function (req, file, cb) {
    const name = Date.now() + '-' + file.originalname;
    cb(null, name);
  }
});

const imageFilter = function (req, file, cb) {
  // accept image only
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    req.fileValidationError = 'Only image files are allowed!';
    return cb(null, false);
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFilter });

app.post('/updateproduct', upload.array('image'), function (req, res) {
  if (req.fileValidationError) {
    return res.status(400).json({ error: req.fileValidationError });
  }
  res.status(200).json({ message: 'Image uploaded successfully' });
});


router.use(session({secret:process.env.sessionsecret,resave:true,saveUninitialized:false}));

router.get('/',adminauth.isLogout,adminController.adminloadlogin)
 router.post('/',adminController.verifyadmin)

 router.get('/home',adminauth.isLogout,adminController.adminhome)
 
 router.get('/logout',adminauth.isLogin,adminController.adminlogout)
// router.post('/adminsignup',adminController.adminsignup)

router.get('/dashboard',adminauth.isLogin,adminController.loaddashboard)

router.get('/product',adminauth.isLogin,productController.loadproduct)
router.get('/block/:id',productController.blockproduct)

router.get('/product/addproduct',productController.loadaddproduct)
router.post('/product/addproduct',upload.array('image',10), productController.addproduct)

router.get('/updateproduct',adminauth.isLogin,productController.loadupdateproduct)
router.post('/updateproduct', upload.array('image',10),productController.updateproduct)


router.get('/category',adminauth.isLogin,categoryController.listcategory)
router.get('/addcategory',adminauth.isLogin,categoryController.loadaddcategory)
router.post('/addcategory',upload.single('image') ,categoryController.addcategory)

router.get('/editcategory',adminauth.isLogin,categoryController.loadeditcategory)
router.post('/editcategory',upload.single('image'),categoryController.editcategory)


router.post('/delete',adminauth.isLogin,categoryController.deletecategory)

router.get('/blockuser/:id',adminController.blockuser)

router.get('/loadaddcoupon',adminauth.isLogin,cartController.loadaddcoupon)
router.post('/loadaddcoupon',adminauth.isLogin,cartController.addcoupon)


router.get('/coupons',adminauth.isLogin,cartController.coupons)
router.get('/deletecoupons',adminauth.isLogin,cartController.deletecoupon)


router.get('/editcoupon',adminauth.isLogin,cartController.loadeditcoupon)
router.post('/editcoupon',adminauth.isLogin,cartController.editcoupon)



router.get('/adminorderhistory',adminauth.isLogin,cartController.adminorderhistory)
// router.get('/editstatus',adminauth.isLogin,cartController.adminstatusedit)
router.post('/adminorderhistory',adminauth.isLogin,cartController.editstatus)
router.get('/adminorderhistorydetails',adminauth.isLogin,cartController.adminorderhistorydetails)

router.get('/orderpending',adminauth.isLogin,cartcontroller.adminloadpending)
router.get('/orderreturn',adminauth.isLogin,cartcontroller.adminloadreturn)
router.get('/orderdelivered',adminauth.isLogin,cartcontroller.adminloaddelivered)
router.get('/ordercancel',adminauth.isLogin,cartcontroller.adminloadcancel)



router.get('/report',adminauth.isLogin,adminController.reports)
router.post('/getOrders',adminauth.isLogin,adminController.getorders)

router.get('/exceldownload',adminauth.isLogin,adminController.excelDownload)


router.get('/banner',adminauth.isLogin,bannerController.loadbanner)
router.post('/banner',adminauth.isLogin,upload.single('image'),bannerController.addbanner)

router.get('/managebanner',adminauth.isLogin,bannerController.managebanner)
router.post('/deletebanner',adminauth.isLogin,bannerController.deletebanner)






router.get('*',function(req,res){
    
  res.redirect('/admin/adminhome')

})
module.exports = router;
