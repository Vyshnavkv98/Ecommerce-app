const category = require('../Model/categorymodel');
const products = require('../Model/Productmodel');
const user = require('../Model/usermodel');
const order = require('../Model/ordermodel')
const wishlist = require('../Model/wishlistmodel')
const coupon = require('../Model/couponmodel')
const razorpay = require('razorpay');
const easyinvoice = require('easyinvoice')
const fs = require('fs')
const { findOne } = require('../Model/couponmodel');
const Wishlist = require('../Model/wishlistmodel');
const moment = require('moment-timezone');

let instance = new razorpay({
  key_id: process.env.keyid,
  key_secret: process.env.keysecret,
});

function calcSubtotal(cartData) {
  let subtotal = 0
  for (let i = 0; i < cartData.length; i++) {
    subtotal += cartData[i].product.price * cartData[i].quantity;
  }
  return subtotal;

}

const loadusercart = async (req, res) => {

  try {
    const data = req.session.userdata
    const id = data._id
    const userdata = await user.findById(id)
    const User = await user.findOne({ _id: id }).populate('cart.product')
    const cartdata = User.cart
    subtotal = calcSubtotal(cartdata)
    req.session.subtotal = subtotal
    res.render('users/usercart', { data, cartdata, subtotal })
  } catch (error) {
    console.log(error.message);
  }
}


const usercart = async (req, res) => {
  try {
    const id = req.body.id
    const productdata = await products.findById(id)

    const data1 = req.session.userdata
      ;
    const productId = req.body.id
    const image = productdata.image[0]
    const userId = id//TODO: the logged in user id

    const existed = await user.findOne({ _id: data1._id, "cart.product": id })
    const quantity = 1


    const data = req.session.userdata

    if (existed) {
      const userData = await user.findOneAndUpdate({ _id: data1._id, "cart.product": id }, { $inc: { "cart.$.quantity": quantity } }, { new: true });


      // req.session.userdata = userData;
      const data = req.session.userdata
      res.render('users/productdetails', { productdata, data, iscartdata: existed });


    } else {
      const userData = await user.findByIdAndUpdate(data1._id,
        {
          $push: {
            cart: {
              product: id,

            }
          }
        }, { new: true })

      // req.session.userdata = userData;
      const data = req.session.userdata
      // res.render('users/productdetails', { productdata, data });
    }
    res.redirect('back')

  } catch (err) {
    console.log(err);
    res.render('users/error');
  }
};
const usercart1 = async (req, res) => {
  try {
    const id = req.body.id
    const productdata = await products.findById(id)

    const data1 = req.session.userdata
      ;
    const productId = req.body.id
    const image = productdata.image[0]
    const userId = id//TODO: the logged in user id

    const existed = await user.findOne({ _id: data1._id, "cart.product": id })
    const quantity = 1


    const data = req.session.userdata

    if (existed) {
      const userData = await user.findOneAndUpdate({ _id: data1._id, "cart.product": id }, { $inc: { "cart.$.quantity": quantity } }, { new: true });


      // req.session.userdata = userData;
      const data = req.session.userdata
      res.json({ message: "Added to cart \u2713" })


    } else {
      const userData = await user.findByIdAndUpdate(data1._id,
        {
          $push: {
            cart: {
              product: id,

            }
          }
        }, { new: true })

      // req.session.userdata = userData;
      const data = req.session.userdata
      // res.render('users/productdetails', { productdata, data });
    }
    res.json({ data: "Added to cart \u2713" })

  } catch (err) {
    console.log(err);
    res.render('users/error');
  }
};

const deletecart = async (req, res) => {
  try {
    const cartid = req.query.id
    const id = req.session.userdata._id
    const users = await user.findOneAndUpdate({ _id: id }, // replace with the ID of the user document
      { $pull: { cart: { _id: cartid } } }, { new: true }    // replace with the criteria to match the object you want to delete
    )

    res.redirect('/cart')
  } catch (error) {
    res.render('/error')
  }
}




const updatecart = async (req, res) => {

  try {
    const data1 = req.session.userdata
    const id = data1._id
    const productid = req.body.id
    const User = await user.findOne({ _id: id }).populate('cart.product')
    const cartdata = User.cart
    const productdata = User.cart.product

    const addressdata = User.address
    const walletamount = User.wallet?.balance



    if (cartdata.length !== 0) {
      const total = calcSubtotal(cartdata)
      req.session.subtotal = total
      const subtotal = req.session.subtotal
      await user.findByIdAndUpdate(data1._id,
        {
          $set: {
            totalbill: subtotal,
          }
        })

      delete req.session.subtotal
      return res.render('users/checkout', { data: User, addressdata, cartdata, subtotal, walletamount: walletamount })



    } else {
      res.redirect('/cart')
    }



  } catch (error) {
    res.render('users/error')
  }
}
const applywallet = async (req, res) => {
  try {
    const userid = req.session.userdata._id
    const userdata = await user.findById(userid)
    const walletamount =Number( userdata.wallet.balance)
    const finalbill =parseFloat( req.body.finalbill)

    console.log(finalbill);
    let finalafterwallet
    let appliedamount
    let finalbalance
    const final = finalbill - walletamount
    const isChecked=req.body.isChecked
   
   
    await user.findByIdAndUpdate(userid,{
      $set:{
        'wallet.balance':finalbalance
      }
      
    })
    console.log(finalafterwallet,finalbill,walletamount,finalbalance,appliedamount,'qqqqqqqqqqqqqqqqqqqqqqqqqq');

    res.json({finalafterwallet:finalafterwallet,appliedamount:appliedamount,finalbalance:finalbalance,walletamount:walletamount})
  


  
  } catch (error) {
    console.log(error.message);
  }
}



const loadorder = async (req, res) => {
  try {
    const userdata = req.session.userdata;
    const userid = userdata._id
    const orderdata = await order.find({ owner: userid }).populate("items.product").sort({ orderdate: -1 })
    // Extract relevant data from orderdata array
    const addressdata = orderdata.map(order => order.address);
    const cartdata = orderdata.map(order => order.cart);

    res.render('users/orderhistory', { orderdata, addressdata, cartdata, data: userdata });




  } catch (error) {
    res.render('users/error')
  }
}

const loadpacking = async (req, res) => {
  try {
    const userdata = req.session.userdata;
    const userid = userdata._id
    const orderdata = await order.find({ owner: userid, orderstatus: 'packing' }).populate("items.product")


    // Extract relevant data from orderdata array
    const addressdata = orderdata.map(order => order.address);
    const cartdata = orderdata.map(order => order.cart);


    res.json({ orderdata: orderdata })




  } catch (error) {
    res.render('users/error')
  }
}
const loaddelivered = async (req, res) => {
  try {
    const userdata = req.session.userdata;
    const userid = userdata._id
    const orderdata = await order.find({ owner: userid, orderstatus: 'delivered' }).populate("items.product")


    // Extract relevant data from orderdata array
    const addressdata = orderdata.map(order => order.address);
    const cartdata = orderdata.map(order => order.cart);


    res.json({ orderdata: orderdata })




  } catch (error) {
    res.render('users/error')
  }
}
const loadcancel = async (req, res) => {
  try {
    const userdata = req.session.userdata;
    const userid = userdata._id
    const orderdata = await order.find({ owner: userid, orderstatus: 'cancel' }).populate("items.product")


    // Extract relevant data from orderdata array
    const addressdata = orderdata.map(order => order.address);
    const cartdata = orderdata.map(order => order.cart);


    res.json({ orderdata: orderdata })




  } catch (error) {
    res.render('users/error')
  }
}
const loadreturn = async (req, res) => {
  try {
    const userdata = req.session.userdata;
    const userid = userdata._id
    const orderdata = await order.find({ owner: userid, orderstatus: 'return' }).populate("items.product")


    // Extract relevant data from orderdata array
    const addressdata = orderdata.map(order => order.address);
    const cartdata = orderdata.map(order => order.cart);


    res.json({ orderdata: orderdata })



  } catch (error) {
    res.render('users/error')
  }
}
const loadpending = async (req, res) => {
  try {
    const userdata = req.session.userdata;
    const userid = userdata._id
    const orderdata = await order.find({ owner: userid, orderstatus: 'pending' }).populate("items.product")
    // Extract relevant data from orderdata array
    const addressdata = orderdata.map(order => order.address);
    const cartdata = orderdata.map(order => order.cart);
    res.json({ orderdata: orderdata })


  } catch (error) {
    res.render('users/error')
  }
}
const ordersuccess = async (req, res) => {
  try {
    const userdata = req.session.userdata
    const userid = userdata._id
    const orderdata = await order.find({ owner: userid }).populate("items.product")
    req.session.orderdata = orderdata


    res.render('users/ordersuccess', { orderdata, userdata })
    const userdatas = await user.findById(userid)
    if (userdatas) {
      userdatas.cart = []
    }
  } catch (error) {
  }
}

let totalbill
const loadpayment = async (req, res) => {
  try {

    const userid = req.session.userdata._id
    console.log(userid,'userAIOddsdsaf sdfasdf');
    const userdata = await user.findById(userid)
    const addressid = req.body.address
    const walletapplied=req.body.walletapplied
    const subtotal=req.body.subtotal

    const addressdata = await user.findOne({ _id: userid, "address.$._id": req.body.address }).populate('cart.product')


    let cartdata = userdata.cart.map((item) => {
      return {
        product: item.product,
        quantity: item.quantity
      }

    })

    const addressToFind = addressdata.address.find((address) => {
      return address._id.toString() === addressid;
    });

    let addr = {

      name: addressToFind.name,
      mobile: addressToFind.mobile,
      pincode: addressToFind.pincode,
      locality: addressToFind.locality,
      address: addressToFind.address,
      city: addressToFind.city,
      state: addressToFind.state,
      landmark: addressToFind.landmark,
      alternatenumber: addressToFind.alternatenumber


    }


    totalbill = req.body.totalbill
    const paymentmode = req.body.paymentmode
    const currentdate = new Date()
    const now = moment.tz('Asia/Kolkata');

    const orderdate = now.format('YYYY-MM-DD hh:mm:ss A');


    if (paymentmode === 'cod') {
      if (cartdata !== 0) {

        const orders = new order({
          owner: userid,
          address: addr,
          items: cartdata,
          totalbill: totalbill,
          paymentmode: paymentmode,
          orderdate: orderdate,
          walletapplied:walletapplied,
          subtotal:subtotal

        })
        await orders.save()

        await Promise.all(userdata.cart.map(async (item) => {
          const productData = await products.findOne({ _id: item.product });
          const newQuantity = productData.quantity - item.quantity;
          await products.findOneAndUpdate(
            { _id: item.product },
            { $set: { quantity: newQuantity } }
          );
        }));

        const orderdata = await order.find({ owner: userid }).populate("items.product")

        req.session.orderdata = orderdata


        res.render('users/ordersuccess', { orderdata, userdata })


        await addressdata.save()

      } else {
        res.redirect('/shop')
      }

    } else {




      const orders = new order({
        owner: userid,
        address: addr,
        items: cartdata,
        totalbill: totalbill,
        paymentmode: 'razorpay',
        orderdate: orderdate,
        walletapplied:walletapplied,
        subtotal:subtotal

      })
      await orders.save()

      await Promise.all(userdata.cart.map(async (item) => {
        const productData = await products.findOne({ _id: item.product });
        const newQuantity = productData.quantity - item.quantity;
        await products.findOneAndUpdate(
          { _id: item.product },
          { $set: { quantity: newQuantity } }
        );
      }));



      await addressdata.save()

      const orderid = orders._id

      // const cartdata = await user.findById(userid).populate('cart.product')
      const pros = addressdata.cart.map((item) => item.product)
      res.render('users/razorpay', { orderid: orderid, totalbill: totalbill, productdata: pros })
      addressdata.cart = [];

    }
  } catch (error) {
    console.log(error.message);
    res.render('users/error')
  }
}




const postorder = async (req, res) => {
  try {

    const userdata = req.session.userdata
    const userid = userdata._id

    const amount = req.body.amount
    console.log(amount);

    let options = {
      amount: totalbill * 100,  // amount in the smallest currency unit
      currency: "INR",
      receipt: "rcp1"
    };
    instance.orders.create(options, function (err, order) {
   console.log(err.message,'ordererrererere');
      res.send({ orderId: order.id })
    });

  } catch (error) {
    console.log(error.message);
    res.render('users/error')

  }
}

const paymentverify = async (req, res) => {

  let body = req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;

  let crypto = require("crypto");
  let expectedSignature = crypto.createHmac('sha256', 'S8zNEyNRF4k62nuLEtrcA7NR')
    .update(body.toString())
    .digest('hex');
  console.log("sig received ", req.body.response.razorpay_signature);
  console.log("sig generated ", expectedSignature);
  let response = { "signatureIsValid": "false" }
  if (expectedSignature === req.body.response.razorpay_signature)
    response = { "signatureIsValid": "true" }
  res.send(response);


};


const loadorderdetails = async (req, res) => {
  try {
    const userdata = req.session.userdata;
    const userid = userdata._id
    const id = req.query.id;
    const orderdata = await order.findOne({ owner: userid, _id: id }).populate('items.product')
    const orderstatus = orderdata.orderstatus
    console.log(orderdata.items, 'yyyyyyyyyyy');
    const orderid = id
    res.render('users/orderhistorydetails', { orderdata: orderdata, data: userdata, orderstatus: orderstatus, orderid: orderid })
  } catch (error) {
    res.render('users/error')

    console.log(error.message);
  }
}


const cancelorder = async (req, res) => {
  try {
    const userdata = req.session.userdata;
    const userid = userdata._id
    const id = req.query.id;
    console.log(id);
    const walletdata = await user.findById(userid)
    let walletamount = walletdata.wallet.balance



    const orderData = await order.findOne({ owner: userid, _id: id }).populate("items.product");
    const paymentmode = orderData.paymentmode




    await Promise.resolve(order.findOneAndUpdate(
      { owner: userid, _id: id },
      { $set: { orderstatus: "cancel" } },
      { new: true }
    )).then(async (result) => {
      if (paymentmode === 'cod') {
        walletamount += Number(result.totalbill);
        await user.findOneAndUpdate(
          { _id: userid },
          { $set: { 'wallet.balance': walletamount } },
          { new: true }
        );
      }
    });



    // Calculate the new total quantity for each product and update it in the database
    await Promise.all(orderData.items.map(async (item) => {
      const productData = await products.findOne({ _id: item.product });
      const newQuantity = productData.quantity + item.quantity;
      await products.findOneAndUpdate(
        { _id: item.product },
        { $set: { quantity: newQuantity } }
      );
    }));

    res.redirect('/orderhistory')
  } catch (error) {
    console.log(error.message);
    res.render('users/error')
  }
}


const returnorder = async (req, res) => {
  try {
    const userdata = req.session.userdata;
    const userid = userdata._id
    const id = req.query.id;
    const orderdata = await order.find({ _id: id }).populate("items.product")
    const items = orderdata.map((item) => item.items)
    const productid = items.map((item) => item.product)

    await order.findOneAndUpdate(
      {
        owner: userdata._id,
        _id: id,
      },
      {
        $set: { orderstatus: "return" }
      }, { new: true })

    await Promise.all(userdata.cart.map(async (item) => {
      const productData = await products.findOne({ _id: item.product });
      const newQuantity = productData.quantity - item.quantity;
      await products.findOneAndUpdate(
        { _id: item.product },
        { $set: { quantity: newQuantity } }
      );
    }));


    res.redirect('/orderhistory')

  } catch (error) {

    console.log(error.message);
    res.render('users/error')

  }
}

//coupon
const coupons = async (req, res) => {
  try {

    const coupons = await coupon.find();
    res.render('coupons', { coupondata: coupons })

  } catch (error) {
    console.log(error.message);
  }

}




const loadaddcoupon = async (req, res) => {
  try {
    res.render('addcoupon')

  } catch (error) {
    console.log(error.message);
  }
}



const addcoupon = async (req, res) => {

  try {
    const coupondata = await coupon.find()
    if (Object.values(req.body).some(value => !value.trim() || value.trim().length === 0)) {
      res.render('addcoupon', { message: 'please fill the field', coupondata })
    } else {
      const coupons = new coupon({
        code: req.body.code,
        discount: req.body.discount,
        expiresAt: req.body.expiresAt,
        status: req.body.status,
        minbill: req.body.minbill

      })
      await coupons.save()
      res.render('addcoupon', { message: 'coupon added successfully...!' })
    }

  } catch (error) {
    console.log(error.message);
    res.render('users/error')
  }
}
const deletecoupon = async (req, res) => {

  try {
    const id = req.query.id
    const coupons = await coupon.findOneAndDelete({ _id: id })
    res.redirect('/admin/coupons')

  } catch (error) {
    console.log(error.message);
  }
}


const loadeditcoupon = async (req, res) => {
  try {
    const id = req.query.id
    const coupondata = await coupon.findById({ _id: id })
    console.log(coupondata);



    res.render('editcoupon', { coupondata })

  } catch (error) {
    console.log(error.message);
  }
}



const editcoupon = async (req, res) => {

  try {
    const id = req.body.id
    const coupondata = await coupon.findByIdAndUpdate(id, {
      $set: {
        code: req.body.code,
        discount: req.body.discount,
        expiresAt: req.body.expiresAt.shift(),
        status: req.body.status,
        minbill: req.body.minbill

      }
    },{new:true})
    const coupondatas = await coupon.find()
    res.render('coupons', { coupondata: coupondatas })

  } catch (error) {
    console.log(error.message);
    res.render('users/error')
  }
}



const editstatus = async (req, res) => {
  try {
    const userdata = req.session.userData;
    const userid = userdata._id

    const id = req.body.id;
    const status = req.body.status
    console.log(status);
    console.log(id);
    const orderdata = await order.findOne({ _id: id })
    console.log(orderdata); 

    await order.findOneAndUpdate(

      {
        _id: id,
      },
      {
        $set: { orderstatus: status }
      }, { new: true })
    console.log('from order history');


    res.redirect(req.originalUrl)
  } catch (error) {

    console.log(error.message);
    res.render('users/error')

  }
}




const adminorderhistory = async (req, res) => {


  try {
    const userdata = req.session.userData;
    const userid = userdata._id
    console.log(userid);
    const orderdata = await order.find().populate("items.product").sort({ orderdate: -1 })
    const addressdata = orderdata.address

    const cartdata = orderdata.cart

    res.render('adminorderhistory', { orderdata: orderdata })
  } catch (error) {
    res.render('users/error',)
  }
}

const adminorderhistorydetails = async (req, res) => {
  try {
    const userdata = req.session.userData;
    const userid = userdata._id
    const id = req.query.id;
    console.log(id, userid);
    const orderdata = await order.findOne({ _id: id }).populate('items.product')
    console.log(orderdata);
    const orderid = id
    res.render('adminorderhistorydetails', { orderdata: orderdata, data: userdata, orderid: orderid })

  } catch (error) {
    console.log(error.message);
  }
}
const adminloadpacking = async (req, res) => {
  try {
    const userdata = req.session.userData;
    const userid = userdata._id
    console.log(userid);
    const orderdata = await order.find({ orderstatus: 'packing' }).populate("items.product")


    // Extract relevant data from orderdata array
    const addressdata = orderdata.map(order => order.address);
    const cartdata = orderdata.map(order => order.cart);


    res.json({ orderdata: orderdata })




  } catch (error) {
    res.render('users/error')
  }
}
const adminloaddelivered = async (req, res) => {
  try {
    const userdata = req.session.userData;
    const userid = userdata._id
    console.log(userid);
    const orderdata = await order.find({ orderstatus: 'delivered' }).populate("items.product")


    // Extract relevant data from orderdata array
    const addressdata = orderdata.map(order => order.address);
    const cartdata = orderdata.map(order => order.cart);


    res.json({ orderdata: orderdata })




  } catch (error) {
    res.render('users/error')
  }
}
const adminloadcancel = async (req, res) => {
  try {
    const userdata = req.session.userData;
    const userid = userdata._id
    console.log(userid);
    const orderdata = await order.find({ orderstatus: 'cancel' }).populate("items.product")


    // Extract relevant data from orderdata array
    const addressdata = orderdata.map(order => order.address);
    const cartdata = orderdata.map(order => order.cart);


    res.json({ orderdata: orderdata })




  } catch (error) {
    res.render('users/error')
  }
}
const adminloadreturn = async (req, res) => {
  try {
    const userdata = req.session.userData;
    const userid = userdata._id
    console.log(userid);
    const orderdata = await order.find({ orderstatus: 'return' }).populate("items.product")


    // Extract relevant data from orderdata array
    const addressdata = orderdata.map(order => order.address);
    const cartdata = orderdata.map(order => order.cart);


    res.json({ orderdata: orderdata })



  } catch (error) {
    res.render('users/error')
  }
}
const adminloadpending = async (req, res) => {
  try {


    const orderdata = await order.find({ orderstatus: 'pending' }).populate("items.product")

    // Extract relevant data from orderdata array
    const addressdata = orderdata.map(order => order.address);
    const cartdata = orderdata.map(order => order.cart);


    // res.render('orderhistory/pending', { orderdata, addressdata, cartdata, userdata });

    res.json({ orderdata: orderdata })


  } catch (error) {
    res.render('users/error')
  }
}


const cartoperation = async (req, res) => {
  try {
    const userData = req.session.userData
    let data = await user.find({ _id: userData._id }, { _id: 0, cart: 1 }).lean()
    console.log(data[0].cart, 'data cartt');

    data[0].cart.forEach((val, i) => {
      val.quantity = req.body.datas[i].quantity
    })

    console.log(data[0].cart, '<<updated cart array 149');

    await user.updateOne({ _id: userData._id }, { $set: { cart: data[0].cart } })

    res.json('from backend ,cartUpdation json')

  } catch (error) {
    console.log(error);
  }
}




const applyCoupon = async (req, res) => {
  try {


    const code = req.body.val;
    const bill = req.body.bill;
    const couponexist = await coupon.findOne({ code: code })

    if (couponexist) {
      const expdate = couponexist.expiresAt
      const discount = couponexist.discount
      const discountvalue = bill * discount / 100
      const currentDate = new Date();
      if (expdate > currentDate) {
        const userdata = req.session.userdata
        const userid = userdata._id;
        const useduser = couponexist.useduser.includes(userid)

        if (!useduser) {
          const final = Math.floor(bill - (bill * discount) / 100);
          const useduser = await coupon.findOneAndUpdate(
            { code: code },
            { $addToSet: { useduser: userid } },
            { new: true }
          );
          res.json({ finalbill: final, totalbill: bill, discountprice: discountvalue })
        } else {
          res.json({ finalbill: bill, message: 'Coupon already applied...!' });
        }

      } else {
        res.json({ finalbill: bill, message: 'Coupon Expired...!' });
      }
    } else {
      res.json({ finalbill: bill, message: 'Coupon doesnot exist...!' })
    }
  } catch (error) {
    console.log(error.message);
    res.render('users/error')
  }
}





const applyCoupon1 = async (req, res) => {
  const code = req.body.val;
  const bill = req.body.bill;


  await coupon.findOne({ code: code }).then((coupon1) => {

    if (coupon1) {
      if (coupon1.status != "Applied") {
        const coupDate = new Date(coupon1.expiryDate);
        const currDate = new Date();
        const status =
          currDate.getTime() > coupDate.getTime() ? "Expired" : "Active";
        coupon.findOneAndUpdate(
          { code: code },
          { $set: { status: status } }
        ).then((coupon3) => {
          coupon.findOne({ code: code }) //extra validation
            .then((Vcoupon) => {
              console.log(Vcoupon.minbill);

              if (Vcoupon.minbill < bill) {
                req.session.applyedCoupon = Vcoupon;
                const final = bill - (bill * Vcoupon.value) / 100;

                req.session.orderBill = final;
              }
              res.json(coupon1);
            });
        });
      } else {
        res.json(coupon1);
      }
    } else {
      res.json(307);
    }
  });
};


const loadwishlist = async (req, res) => {
  try {
    const userid = req.session.userdata._id
    const userdata = await user.findById(userid)

    const wishlistdata = await wishlist.find({ owner: userid })
    const wishlistitems = wishlistdata.map(item => item.items)
    console.log(wishlistitems);

    const wishlistitemcount = wishlistitems[0].length

    res.render('users/wishlist', { wishlist: wishlistdata, data: userdata, wishlistitemcount: wishlistitemcount })

  } catch (error) {
    res.render('users/error')
    console.log(error.message);
  }
}

const addToWishlist = async (req, res) => {
  try {

    const productid = req.body.id
    const userid = req.session.userdata._id
    const userdata = await user.findById(userid)
    console.log(userdata);
    const wishlistdata = await wishlist.findOne({ owner: userdata._id })
    const productdata = await products.findOne({ _id: productid })
    if (wishlistdata) {

      await wishlist.findOneAndUpdate(
        { owner: userdata._id },
        { $addToSet: { items: productdata } }, { new: true }
      )
      res.json({ data: 'add' })
    } else {
      const newWishlist = new wishlist({
        owner: userdata._id,
        items: productdata,

      })

      await newWishlist.save()
      res.json({ data: 'add' })
    }
  } catch (error) {

  }
}

const deletewishlist = async (req, res) => {
  try {

    const id = req.body.id;
    const userData = req.session.userdata;
    await wishlist.findOneAndUpdate(
      { owner: userData._id },
      { $pull: { items: { _id: id } } }
    )
    res.json("done");


  } catch (error) {
    res.render('users/error')
    console.log(error.message);
  }
}

const wishlistaddtocart = async (req, res) => {
  try {
    const id = req.body.id

    const productdata = await products.findById(id)

    const data1 = req.session.userdata
      ;
    // const productId = req.body.id
    // const image = productdata.image[0]
    const userId = id//TODO: the logged in user id

    const existed = await user.findOne({ _id: data1._id, "cart.product": id })
    const quantity = 1
    const wishlistdata = await wishlist.find()

    const data = req.session.userdata

    if (existed) {



      const data = req.session.userdata
      res.json({ message: 'ok' })


    } else {
      const userData = await user.findByIdAndUpdate(data1._id,
        {
          $push: {
            cart: {
              product: id,

            }
          }
        }, { new: true })

      await wishlist.findOneAndUpdate(
        { owner: userData._id },
        { $pull: { items: { _id: id } } }
      )


      // req.session.userdata = userData;
      const data = req.session.userdata

      res.json({ message: 'ok' })
    }

  } catch (err) {
    console.log(err);
    res.render('users/error');
  }
};


const invoice = async (req, res) => {
  try {
    const orderid = req.query.id
    console.log(orderid);
    const userdata = req.session.userdata
    const userid = userdata._id
    const userdatas = await user.findById(userid).populate('cart.product')
    const orderdata = await order.findById(orderid).populate('items.product')
    console.log(orderdata, 'from invoice');

    const productdata = orderdata.items

    const invoiceItems = []

    productdata.map((item) => {
      const product = item.product
      const quantity = item.quantity
      const total = product.price * quantity
      const pro = {
        'name': `${product.name}`,
        "quantity": `${quantity}`,
        'description': `${product.description}`,
        'total': `${total}`,
        'price': `${product.price}`
      };

      invoiceItems.push(pro);
    })

    var currentDate = new Date()

    var data = {

      "customize": {

      },
      "images": {
        // The logo on top of your invoice
        "logo": "https://public.easyinvoice.cloud/img/logo_en_original.png",

        // "background": "https://public.easyinvoice.cloud/img/watermark-draft.jpg"
      },
      // Your own data
      "sender": {
        "company": "Ashion",
        "address": "HSR Layout 4th phase",
        "zip": "670895 ",
        "city": "Bengaluru",
        "country": "India"

      },
      // Your recipient
      "client": {
        "company": `${orderdata.address.name}`,
        "address": `${orderdata.address.mobile},${orderdata.address.locality},${orderdata.address.address},${orderdata.address.pincode}
               ,${orderdata.address.landmark}`,
        "zip": `${orderdata.address.pincode}`,
        "city": `${orderdata.address.locality}`,
        "country": "India"
        // "custom1": "custom value 1",
        // "custom2": "custom value 2",
        // "custom3": "custom value 3"
      },
      "information": {
        // Invoice number
        "number": `${orderdata._id}`,
        // Invoice data
        "date": "12-12-2023",
        // Invoice due date
        "due-date": "31-12-2021"
        ,
      },



      "products": invoiceItems,


      // The message you would like to display on the bottom of your invoice
      "bottom-notice": "Kindly pay your invoice within 15 days.",
      // Settings to customize your invoice
      "settings": {
        "currency": "INR",
        "locale": "nl-NL",
        "tax-notation": "gst",
        "margin-top": 25,
        "margin-right": 25,
        "margin-left": 25,
        "margin-bottom": 25,
        "format": "A4",
        "height": "1000px",
        "width": "500px",
        "orientation": "landscape",
      },

    };

    //Create your invoice! Easy!
    await easyinvoice.createInvoice(data, function (result) {
      //The response will contain a base64 encoded PDF file

      easyinvoice.createInvoice(data, function (result) {
        //The response will contain a base64 encoded PDF file
        const fileName = 'invoice.pdf';
        const pdfBuffer = Buffer.from(result.pdf, 'base64');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
        res.send(pdfBuffer);
      })
      console.log('PDF base64 string: ');
    });
  } catch (error) {
    console.log(error.message);
  }
}


const loadwallet = async (req, res) => {
  try {
    res.render('users/wallet')
  } catch (error) {
    console.log(error.message);
  }
}



module.exports = {
  loadusercart,
  usercart,
  usercart1,
  deletecart,
  updatecart,
  loadpayment,
  loadorder,
  loadpending,
  loadpacking,
  loadreturn,
  loadcancel,
  loaddelivered,
  postorder,
  ordersuccess,
  paymentverify,
  loadorderdetails,
  cancelorder,
  returnorder,
  loadaddcoupon,
  addcoupon,
  coupons,
  deletecoupon,
  loadeditcoupon,
  editcoupon,
  adminorderhistory,
  adminorderhistorydetails,
  cartoperation,
  applyCoupon,
  loadwishlist,
  addToWishlist,
  deletewishlist,
  wishlistaddtocart,
  editstatus,
  invoice,
  loadwallet,
  applywallet,
  adminloadpending,
  adminloadpacking,
  adminloadreturn,
  adminloadcancel,
  adminloaddelivered,


}

