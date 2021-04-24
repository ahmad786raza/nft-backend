const Usersmodal = require('../modals/users');
const Paymentmodal = require('../modals/Paymentmodal');
const Registermodal = require("../modals/register");
const Tokennotlistusermodel = require('../modals/tokennotlistmodel');
const assetabi = require('../abis/assets.json');
const ethers = require("ethers");
const jwt = require('jsonwebtoken');
const ipfsAPI = require('ipfs-api');
const fs = require('fs');
const bcrypt = require('bcrypt');
const Mongoose  = require('mongoose');
require('dotenv').config();
const ipfs = ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' })
const saltRounds = 10;




class Users {


    uploadImage(req, res, next) {
        const { assetName, price, description, tokenId, owner, ipfsHash, email } = req.body
        console.log("req.body uploadimage", req.body)
        const users = new Usersmodal({
            assetName: assetName,
            price: price,
            ipfsHash: ipfsHash,
            description: description,
            tokenId: tokenId,
            owner: owner,
            email: email
        })
        users.save()
            .then((result) => {
                    return res.json({ status: true, message: "Image uploaded successfull.", data: result })
            }).catch((err) => {
                console.log("erro in saving data",err);
                return res.json({ status: false, message: "Image upload failed." })

            })
    };

    getTokenID(req, res) {
        Usersmodal.countDocuments().then((count) => {
            console.log('========count', count)
            var tokenID = ++count
            return res.json({ status: true, message: "All Id Fetched", data: tokenID })
        }).catch((errr) => {
            res.json({ status: false, message: "Something went wrong,TokenId not fetched" })
        })

    }

    updateListedTable = (req, res) => {
        console.log("req.body", req.body)
        const { id , status } = req.body

        var data_status;

        if(status === 'Not-Hidden')data_status = 1
        else data_status = 0

        Usersmodal.findOneAndUpdate({ "_id": Mongoose.Types.ObjectId(id) }, { $set: { hide: status, status:data_status } }, { new: true }).then((updatedData) => {
            console.log("updatedData", updatedData)
            res.json({status:true,message:" status updated",data:updatedData})
        }).catch((errors) => {
            console.log("errors===", errors)
        })


    }

    getalldata = (req, res) => {
        Usersmodal.find({status:1}).then((result) => {
            return res.json({ status: true, message: "data fetched", data: result })
        }).catch((errrs) => {
            res.json({ status: false, message: "Something went wrong,data not available" })
        })
    }

    getalldataforAdmin = (req, res) => {
        Usersmodal.find().then((result) => {
            return res.json({ status: true, message: "data fetched", data: result })
        }).catch((errrs) => {
            res.json({ status: false, message: "Something went wrong,data not available" })
        })
    }

    getallnotlisteddata = (req, res) => {
        console.log("getallnonlisteddata")
        Tokennotlistusermodel.find().then((result) => {
            console.log("list====", result)
            return res.json({ status: true, message: "All data fetched successfully.", data: result })
        }).catch((errs) => {
            console.log("errr", errs)
            res.json({ status: false, message: "Something went wrong,data not available" })
        })
    }

    getSingleData = (req, res) => {
        const { tokenId } = req.body
        Usersmodal.findOne({ tokenId: tokenId })
            .then((singledata) => {
                return res.json({ status: true, message: "data fetched.", data: singledata })
            })
            .catch((err) => {
                res.json({ status: false, message: "Something went wrong,this token data is not found" })
            })
    }

    payDetails = (req, res) => {
        console.log('requestbody_paydetails', req.body);
        const { assetName, tokenId, newOwnerAddrs, boughtTokenHash, tokenPrice } = req.body;
        const provider = new ethers.providers.JsonRpcProvider('https://rinkeby.infura.io/v3/f99366737d854f5e91ab29dad087fcd5');
        const privatekey = process.env.TOKENOWNER_PRIVATEKEY
        const wallet = new ethers.Wallet(privatekey, provider)
        const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, assetabi, wallet);
        contract.transferFrom(process.env.TOKENOWNER_PUBLICKEY, newOwnerAddrs, tokenId).then((respdata) => {
            if (respdata.hash) {
                // console.log('data=========', respdata.hash, process.env.CONTRACT_ADDRESS, respdata.hash, respdata.from)
                let paydetails = new Paymentmodal({
                    assetName: assetName,
                    tokenId: tokenId,
                    newOwnerAddrs: newOwnerAddrs,
                    contractAddrs: process.env.CONTRACT_ADDRESS,
                    boughtTokenHash: boughtTokenHash,
                    transferTokenHash: respdata.hash,
                    tokenPrice: tokenPrice,
                    fromAddrs: respdata.from,
                })

                paydetails.save().then((saveddata) => {
                    Usersmodal.findOneAndUpdate({ tokenId: tokenId }, { soldStatus: 1 }, { new: true }).then((respo) => {
                        // console.log("respo", respo)
                    }).catch((errss) => {
                        console.log("error")
                    })

                    // console.log("detailssave", saveddata)
                    return res.json({ status: true, message: "Transection successfull,data saved.", data: saveddata })
                }).catch((errs) => {
                    // console.log('errrrrrr', errs)
                    return res.json({ status: false, message: "Transection failed,Something went wrong try again." })
                })
            } else {
                return res.json({ status: false, message: "Transection failed,try again." })
            }

        }).catch((errrs) => {
            // console.log('errrs===', errrs)
            return res.json({ status: false, message: "Transection failed! Something went wrong try again." })

        })
    }

    register = (req, res) => {
        // console.log('req.body_register', req.body)
        const { userName, email, password, confirmPass } = req.body
        if (password !== confirmPass) {
            res.json({ status: false, message: "Confirm Password didn't match" })
        } else {
            Registermodal.findOne({ email: email }).then(async (respdata) => {
                // console.log(respdata)
                if (respdata) {
                    res.json({ status: false, message: "User already exist" })
                } else {
                    var newuser = new Registermodal({
                        userName: userName,
                        email: email,
                        password: await bcrypt.hashSync(password, saltRounds),
                        confirmPass: confirmPass
                    })

                    newuser.save().then((resps) => {
                        // console.log("=====", resps)
                        if (resps) {
                            res.json({ status: true, message: "Registered Successfull,Data saved" })
                        } else {
                            res.json({ status: false, message: "Registration failed,Data not saved." })
                        }
                    })
                }
            }).catch((errs) => {
                console.log("findOne_catchblock", errs)
                res.json({ status: false, message: "Something went wrong,try again" })
            })
        }
    }

    login = (req, res) => {
        const { email, password } = req.body
        console.log("request-body", email, password)
        Registermodal.findOne({ email: email, userType: parseInt(req.body.userType) }).then(async (respp) => {
            if (respp) {
                const match = await bcrypt.compare(password, respp.password);
                if (match) {
                    var token = jwt.sign({ email: respp.email }, process.env.SECRETKEY_JWT);
                    console.log("findone-response", token)
                    var myquery = { email: email };
                    var newvalues = { $set: { token: token } };
                    Registermodal.findOneAndUpdate({ email: email }, { $set: { token: token } }, { new: true }).then((respo) => {
                        console.log("========respo after login", respo)
                       
                            res.json({ status: true, message: "Login successful.", data: respo })
                        
                    }).catch((error)=>{
                        res.json({ status: false, message: error })

                    })
                } else {
                    res.json({ status: false, message: "email and password is incorrect" })
                }
            } else {
                res.json({ status: false, message: "User not found" })
            }

        }).catch((errss) => {
            res.json({ status: false, message: "Something went wrong,try again" })
            // console.log('errss_catchblock', errss)
        })
    }


    tokennotlisted = (req, res) => {
        const { assetName, price, description, tokenId, owner, ipfsHash, email } = req.body
        console.log("==========", req.body)

        const notlistedusers = new Tokennotlistusermodel({
            assetName: assetName,
            price: price,
            ipfsHash: ipfsHash,
            description: description,
            tokenId: tokenId,
            owner: owner,
            email: email
        })
        notlistedusers.save().then((saveddata) => {
            console.log("saveddata====", saveddata)
            if (!saveddata) {
                return res.json({ status: "false", message: "Details not saved." })
            } else {
                return res.json({ status: "true", message: "Details saved.", data: saveddata })
            }
        }).catch((errors) => {
            console.log("errors", errors)
        })

    }

    // sellerdata = (req, res) => {
    //     const totalPrice ;
    //     const exchangePrice;
    //     const tokenBuyingPrice;

    //     const { sellingPrice } = req.body
    //     const 


    // }




}

module.exports = new Users()
