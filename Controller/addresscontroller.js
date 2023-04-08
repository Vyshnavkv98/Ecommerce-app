const address = require('../Model/addressmodel')
const { findByIdAndUpdate } = require('../Model/categorymodel')
const { findById } = require('../Model/usermodel')
const User = require('../Model/usermodel')




const manageaddress = async (req, res) => {
    try {
        const id = req.query.id
        const userdatas = await User.findById(id)
        //  const data=userdata.address.map(item=>{
        //     item.address
        //  })
        const userdata = userdatas.address
        console.log(userdata);
        res.render('users/manageaddress', { userdata, id })




    } catch (error) {
        console.log(error.message);
        res.render("users/error")
    }
}

// async function renderPage() {
//     // const id = req.query.id       
//     //  const userdata = await User.findById(id)
//     try {

//       const response = await fetch('users/adduseraddress.hbs', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'text/html'
//         }
//       });
//       const template = await response.text();
//       const compiledTemplate = hbs.compile(template);
//       const data = { userdata };
//       const html = compiledTemplate(data);
//       document.getElementById('content').innerHTML = html;
//     } catch (error) {
//       console.error('Error rendering page:', error);
//     }
//   }
//   renderPage();




const loadaddress = async (req, res) => {
    try {
        const id = req.query.id
        const userdata = await User.findById(id)
        console.log(userdata);


        res.render('users/adduseraddress', { userdata })

    } catch (error) {
        console.log(error.message);
        res.render("users/error")
    }
}




const addAddress = async (req, res) => {
    try {
        const id = req.body.id
        console.log(id);
        const userdata = await User.findById(id)
        console.log(userdata);
        if (Object.values(req.body).some(value => !value.trim() || value.trim().length === 0)) {
            res.render('users/adduseraddress', { message: 'please fill the field', userdata })

        } else {

            userdata.address.push({
                name: req.body.name,
                mobile: req.body.mobile,
                pincode: req.body.pincode,
                locality: req.body.locality,
                address: req.body.address,
                city: req.body.city,
                state: req.body.state,
                landmark: req.body.landmark,
                alternatenumber: req.body.alternatenumber,
            });
            await userdata.save()
            res.render('users/adduseraddress', { userdata })
        }
    } catch (error) {
        console.log(error.message);
    }
}

const checkoutLoadAddress = async (req, res) => {
    try {
        // res.render('users/checkoutaddaddress')
        res.json()
    } catch (error) {
        console.log(error.message);
        res.redirect('/error')
    }
}


const checkoutAddAddress = async (req, res) => {
    try {
        const id = req.session.userdata._id
        const userdata = await User.findById(id)

            userdata.address.push({
                name: req.body.name,
                mobile: req.body.mobile,
                pincode: req.body.pincode,
                locality: req.body.locality,
                address: req.body.address,
                city: req.body.city,
                state: req.body.state,
                landmark: req.body.landmark,
                alternatenumber: req.body.alternatenumber,
            });
            await userdata.save()
            // res.redirect('/checkout')
            res.json()
        
    } catch (error) {
        console.log(error.message);
    }
}

const deleteaddress = async (req, res) => {
    try {
        const addressid = req.query.id
        console.log(addressid);
        const id = req.session.userdata._id
        console.log(id);
        const users = await User.findOneAndUpdate({ _id: id }, // replace with the ID of the user document
            { $pull: { address: { _id: addressid } } }, { new: true }    // replace with the criteria to match the object you want to delete
        )

        res.redirect('/checkout')
    } catch (error) {
        console.log(error.message);
        res.render('/error')
    }
}
const loadeditaddress=async(req,res)=>{
    try {
        res.render('users/editaddress')
    } catch (error) {
        console.log(error.message);
    }
}

const editaddress = async (req, res) => {
    try {
        const addressid = req.query.id
        console.log(addressid);
        const id = req.session.userdata._id
        const userdata = await User.findById(id)
        console.log(id);
        if (Object.values(req.body).some(value => !value.trim() || value.trim().length === 0)) {
            res.render('users/manageaddress', { message: 'please fill the field', userdata })

        } else {

            userdata.address.push({
                name: req.body.name,
                mobile: req.body.mobile,
                pincode: req.body.pincode,
                locality: req.body.locality,
                address: req.body.address,
                city: req.body.city,
                state: req.body.state,
                landmark: req.body.landmark,
                alternatenumber: req.body.alternatenumber,
            },{new:true});
        }

        } catch (error) {
            console.log(error.message);
            res.render('users/error',{userdata})
        }
    }

module.exports = {
        loadaddress,
        manageaddress,
        addAddress,
        checkoutAddAddress,
        checkoutLoadAddress,
        deleteaddress,
        loadeditaddress,
        editaddress
        
    }