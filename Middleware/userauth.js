const User=require('../Model/usermodel')

const isLogin=async(req,res,next)=>{
    // try {
    //    if(req.session.userdata) {
    //         next()
    //    } else {
    //     res.redirect('/')
    //    } 
    // } catch (error) {
    //     console.log(error.message);
    // }
    next()
}

const isLogout=async(req,res,next)=>{
    try {
        // if(req.session.userdata){
        //     res.redirect('/home')
        // }else{}
        next()
    } catch (error) {
        console.log(error.message);
        
    }
}


 const checkBlocked=async(req, res, next)=> {
    // const userid=req.session.userdata._id
    // const userdata=await User.findOne({_id:userid})

    //   if (userdata && userdata.is_blocked==true) {
    //     req.session.destroy()
    //     return res.redirect('/login');
    //   }
      return next();

    
  }

 
module.exports={
    isLogin,
    isLogout,
    checkBlocked
}