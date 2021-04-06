var express = require('express');
var router = express.Router();
var controllers = require('../controllers/users');

var multer  = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file)
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
 
var upload = multer({ storage: storage })
/* GET users listing. */
router.post('/uploadImage', controllers.uploadImage);
router.get('/getTokenId',controllers.getTokenID);
router.get('/getalldata',controllers.getalldata);
router.post('/getsingledata',controllers.getSingleData);
// router.get('etheraddress',controllers.getEtherAdd)

module.exports = router;
