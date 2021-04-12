const Usersmodal = require('../modals/users');
const Paymentmodal = require('../modals/Paymentmodal');
const assetabi = require('../abis/assets.json');
const ethers = require("ethers");
const ipfsAPI = require('ipfs-api');
const fs = require('fs');
require('dotenv').config();
const ipfs = ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' })




class Users {


    uploadImage(req, res, next) {
        const { assetName, price, description, tokenId, owner,ipfsHash } = req.body 
        const users = new Usersmodal({
            assetName: assetName,
            price: price,
            ipfsHash: ipfsHash,
            description: description,
            tokenId: tokenId,
            owner: owner
        })
        users.save()
            .then((result) => {
                if (result) {
                    return res.json({ status: true, message: "Image uploaded successfull.", data: result })
                }
            }).catch((err) => {
                return res.json({ status: false, message: "Image upload failed." })

            }
            )


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

    getalldata = (req, res) => {
        Usersmodal.find().then((result) => {
            return res.json({ status: true, message: "data fetched", data: result })
        }).catch((errrs) => {
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
        console.log('requestbody', req.body);
        const { assetName, tokenId, newOwnerAddrs, boughtTokenHash, tokenPrice } = req.body;
        const provider = new ethers.providers.JsonRpcProvider('https://rinkeby.infura.io/v3/f99366737d854f5e91ab29dad087fcd5');
        const privatekey = process.env.TOKENOWNER_PRIVATEKEY
        const wallet = new ethers.Wallet(privatekey, provider)
        const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, assetabi, wallet);
        contract.transferFrom(process.env.TOKENOWNER_PUBLICKEY, newOwnerAddrs, tokenId).then((respdata) => {
            if (respdata.hash) {
                console.log('data=========', respdata.hash, process.env.CONTRACT_ADDRESS, respdata.hash, respdata.from)
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
                        console.log("respo", respo)
                    }).catch((errss) => {
                        console.log("error")
                    })

                    console.log("detailssave", saveddata)
                    return res.json({ status: true, message: "Transection successfull,data saved.", data: saveddata })
                }).catch((errs) => {
                    console.log('errrrrrr', errs)
                    return res.json({ status: false, message: "Transection failed,Something went wrong try again." })
                })
            } else {
                console.log('else case=========')
                return res.json({ status: false, message: "Transection failed,try again." })
            }

        }).catch((errrs) => {
            console.log('errrs===', errrs)
            return res.json({ status: false, message: "Transection failed,Something went wrong try again." })

        })
    }




}

module.exports = new Users()
