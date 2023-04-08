const multer = require('multer');
const path=require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,path.join(__dirname,'../public/images'))
      console.log(__dirname);
    },
    filename: function (req, file, cb) {
      const name=Date.now()+'-'+file.originalname;
      cb(null,name)
    }
  });


  const imageFilter = function(req, file, cb) {
    // accept image only
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};


  const upload = multer({ storage: storage ,fileFilter:imageFilter});