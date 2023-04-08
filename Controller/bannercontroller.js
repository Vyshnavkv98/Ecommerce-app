
const bannermodel = require('../Model/bannermodel');


const loadbanner=async(req,res)=>{
    try {
        res.render('banner')
    } catch (error) {
        console.log(error.message);
    }
}
const addbanner=async(req,res)=>{
    try {
        
       console.log( req.body.file,'13');
        if (Object.values(req.body).some(value => !value.trim() || value.trim().length === 0)) {
            res.render('banner', { message: 'please fill the field'})

        } else {
           const banners = new bannermodel({
            name:req.body.name,
            image: req.file.filename,
            description:req.body.description,
           header:req.body.header,
            link:req.body.link
           })
           const bannerdata=await banners.save()
           res.redirect('back')

        }
        
    } catch (error) {
        console.log(error.message);
    }
}
const managebanner=async(req,res)=>{
    try {
        const bannerdata=await bannermodel.find()
        res.render('managebanner',{bannerdata:bannerdata})
        console.log(bannerdata);
    } catch (error) {
        console.log(error.message);
    }
}

const deletebanner = async (req,res) => {
    try {

        const _id = req.body.id
        console.log(_id,'49');
        await bannermodel.findByIdAndDelete(_id)
        res.json("done")
        }
         catch (error) {
        console.log(error.message);
    }
}

module.exports={
    loadbanner,
    addbanner,
    managebanner,
    deletebanner
}