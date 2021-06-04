var express = require('express');
var router = express.Router();
var controllers = require('../controllers/users');
const Registermodal = require("../modals/register");
require('dotenv').config();
const jwt = require('jsonwebtoken');


verifytoken = (req, res, next) => {
    var token = req.headers.authtoken
    console.log("req.headers", req.headers,token)

  if (token) {
      jwt.verify(token, process.env.SECRETKEY_JWT, function (err, respData) {
          if (err) {
            console.log("ifcaseverifytoken",err)
           return res.json({ status: false, message: "Your session has expired! Please login again" })
          } else {
              console.log("decoded", respData.email);
              var email = respData.email;
              Registermodal.findOne({ email: email }).then((response) => {
                  console.log('email founde by token', response);
                  if (response == null || response == "") {
                      return res.json({status:false,message:"User not found"})
                  }else{
                    req.currentuser = response;
                    console.log("cureent user", req.currentuser);
                    next()
                  }
              }).catch((err) => {
                  return res.json({status:false,message:"Something went wrong"})
              });
          }
      });

  } else {
      console.log("elsecase")
      return res.json({status:false,message:"Authorization failed."})
  }
}



 
/* GET users listing. */
router.post('/generateAssets',verifytoken, controllers.generateAssets);
router.get('/getTokenId',verifytoken,controllers.getTokenID);
router.get('/getalldata',controllers.getalldata);
router.post('/getsingledata',verifytoken,controllers.getSingleData);
router.post('/paymentdetail',verifytoken,controllers.payDetails);
router.post('/register',controllers.register);
router.post('/login',controllers.login);
router.post('/updatelisteddata',controllers.updateListedTable);
router.get('/getalldataforAdmin',controllers.getalldataforAdmin);
router.post('/updateassetcount',controllers.updatecouter);
router.post('/userhistory',verifytoken,controllers.userHistory);
router.get('/uritokendetails/:id',controllers.getTokenDetails)
router.post('/updateprice',verifytoken,controllers.updatePrice);
router.post('/cancellisting',verifytoken,controllers.cancelListing);
 router.post('/tokendetails',verifytoken,controllers.tokenDetails)
// router.post('/tokennotlist',controllers.tokennotlisted);
// router.get('/getallnotlisteddata',controllers.getallnotlisteddata);

module.exports = router;


