var mongoose = require('mongoose');
const Admin = require('../Model/adminmodel')
const user = require('../Model/usermodel')
const orders = require('../Model/ordermodel')

const product = require('../Model/Productmodel')
const session = require('express-session')
const multer = require('multer');
const upload = multer({ dest: 'upload/' });
const ExcelJS = require('exceljs')




const argon2 = require("argon2");

const adminloadlogin = async (req, res) => {
  try {
    res.render('adminlogin', { isAdmin: true })
  } catch (error) {
    console.log(error.message)
  }
}

const verifyadmin = async (req, res) => {
  try {
    const email = req.body.email
    console.log(email);
    const password = req.body.password
    const userdata = await Admin.findOne({ email: email })


    if (userdata) {
      if (password == userdata.password) {
        req.session.userData = userdata
        console.log(req.session.user_id);
        res.redirect('/admin/home')
      } else {
        res.render('adminlogin', ({ message: 'Please check your password' }))
      }
    } else {
      res.render('adminlogin', ({ messageerr: `email doesn't exist` }))
    }
  } catch (error) {
    console.log(error.message);
  }
}

const adminhome = async (req, res) => {
  try {

    const orderdata = await orders.aggregate([
      {
        $sort: {
          "orderdate": 1,

        }
      },
      {
        $group: {
          _id: {
            $month: "$orderdate"
          },
          orders: {
            $push: "$$ROOT"
          }
        }
      },

      {
        $project: {
          _id: 0,
          month: "$_id",
          orders: 1
        }
      },
      {
        $sort: {
          "month": 1
        }
      }
    ])


    const usercount=await user.find().count()
    const productcount=await product.find().count()
    const ordersnum = []
    orderdata.forEach(element => {
      const num = element.orders.length
      ordersnum.push(num)
    });
    const ordermonth = []
    orderdata.forEach(element => {
      const num = element.month
      ordermonth.push(num)
    });
    let monthlybill = []
    orderdata.forEach(element => {
      let sum = 0
      element.orders.forEach(total => {
        sum += Number(total.totalbill)

      });
      monthlybill.push(sum)
    });
    console.log(monthlybill);




    const monthNames = ordermonth.map(monthNumber =>
      new Date(0, monthNumber - 1).toLocaleString('default', { month: 'long' })
    );
    const totalorders = await orders.find().count()
    const delivered = await orders.find({ orderstatus: 'delivered' })

    const razorpaycount = await orders.find({ paymentmode: 'razorpay' }).count()

    const codcount = await orders.find({ paymentmode: 'cod' }).count()
    const paymentdata = [razorpaycount, codcount]

    const totalbill = delivered.reduce((sum, element) => {
      return sum + Number(element.totalbill)
    }, 0)
    console.log(totalbill, 124);

    const categorysale = await orders.aggregate([


      {
        $lookup: {
          from: 'products', // Name of the collection you are joining with
          localField: 'items.product',
          foreignField: '_id',
          as: 'product' // Name of the array field where the joined documents will be stored
        }
      },
      {
        $unwind: '$product' // Deconstruct the product array
      },
      {
        $group: {
          _id: '$product.category',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'categories', // Name of the collection you are joining with
          localField: '_id',
          foreignField: '_id',
          as: 'category' // Name of the array field where the joined documents will be stored
        }
      },
      {
        $unwind: '$category' // Deconstruct the category array
      },
      {
        $project: {
          _id: 0,
          category: '$category.name',
          count: 1
        }
      }
    ], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
    });


    const categorycount = [];
    categorysale.forEach((item) => {
      categorycount.push(item.count)
    })

    console.log(categorycount);

    const categories = [];
    categorysale.forEach((item) => {
      categories.push(item.category)
    })
    console.log(categorycount, categories);


    res.render('adminhome', { orders: ordersnum, monthNames: monthNames, totalbill, totalorders, codcount, razorpaycount, paymentdata, monthlybill, categories, categorycount ,usercount, productcount })
  } catch (error) {
    console.log(error.message);
  }
}

const adminlogout = async (req, res) => {
  try {
    req.session.destroy()
    res.redirect('/admin')
  } catch (error) {
    console.log(error.message);
  }
}

const loaddashboard = async (req, res) => {

  const userdata = await user.find()
  let slno = { count: 1 }
  console.log(userdata)
  res.render('admindashboard', { users: userdata })
}

const blockuser = async (req, res) => {
  try {
    const id = req.params.id
    console.log((req.params.id));
    const blockuserdata = await user.findById(id)
    console.log(blockuserdata);
    const blockstatus = blockuserdata.is_blocked
    const userdata = await user.findByIdAndUpdate(
      id, {
      $set: {
        is_blocked: !blockstatus
      }
    }, { new: true }
    )
    res.redirect('/admin/dashboard')

  } catch (error) {
    console.log(error.message);
  }
}


const reports = async (req, res) => {
  try {
    const ordersdata = await orders.find().populate('items.product').sort({ orderdate: -1 })
    res.render('report', { orders: ordersdata })

  } catch (error) {
    console.error(error.message);
  }
}
let monthlyorderdata
const getorders = async (req, res) => {
  try {
    const fromdate = req.body.fromDate
    const toDate = req.body.toDate
    monthlyorderdata = await orders.find({ orderdate: { $gte: fromdate, $lte: toDate } }).populate('items.product').sort({ orderdate: -1 })
    res.json({ orderdata: monthlyorderdata })
  } catch (error) {
    console.log(error.message);
  }
}

const excelDownload = async (req, res) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sales Data");

  // Add headers to the worksheet
  worksheet.columns = [
    { header: "Order ID", key: "_id", width: 10 },
    { header: "Order Date", key: "orderdate", width: 15 },
    { header: "Total Bill", key: "totalBill", width: 10 },
    { header: "totalOrders", key: "totalOrders", width: 10 },
    { header: "totalRevenue", key: "totalRevenue", width: 20 },
  ];

  let sum = 0
  monthlyorderdata.forEach(element => {
    sum += Number(element.totalbill)
  });

  monthlyorderdata.forEach((order) => {
    worksheet.addRow({
      OrderId: order._id,
      OrderDate: order.orderdate,
      totalBill: order.totalbill,
    });

  });
  worksheet.addRow({
    totalOrders: monthlyorderdata.length,
    totalRevenue: sum,
  });
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=" + "SalesData.xlsx"
  );

  workbook.xlsx
    .write(res)
    .then(() => {
      res.end();
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("An error occurred while generating the Excel file");
    });
};

module.exports = {
  adminloadlogin,
  verifyadmin,
  adminhome,
  adminlogout,
  loaddashboard,
  blockuser,
  reports,
  getorders,
  excelDownload


}