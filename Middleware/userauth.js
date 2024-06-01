const User=require('../Model/usermodel')

const isLogin=async(req,res,next)=>{
    // try {
    //    if(req.session.userdata) {
    //         next()
    //    } else {
    //   return res.redirect('/')
    //    } 
    // } catch (error) {
    //     console.log(error);
    // }
    next()
}

const isLogout=async(req,res,next)=>{
    // try {
    //     if(req.session.userdata){
    //        return res.redirect('/home')
    //     }else{}
        next()
    // } catch (error) {
    //     console.log(error.message);
        
    // }
}


 const checkBlocked=async(req, res, next)=> {
    // const userid=req.session.userdata._id
    // const userdata=await User.findOne({_id:userid})

    //   if (userdata && userdata.is_blocked==true) {
    //     req.session.destroy()
    //     return res.redirect('/login');
    //   }
       next();

    
  }

 
module.exports={
    isLogin,
    isLogout,
    checkBlocked
}