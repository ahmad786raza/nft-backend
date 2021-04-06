const Usersmodal = require('../modals/users')
require('dotenv').config();
console.log("PPPPPPPPPPPPP",require('dotenv').config())






class Users {



    uploadImage(req, res, next) {
        const { assetName, price, description, tokenId, owner } = req.body
        const image = req.file
        console.log("req.body", image, req.body)
        if (!image) {
            return res.status(500).json({ message: 'image not found' })
        }

        const artImage = image.path;

        const users = new Usersmodal({
            assetName: assetName,
            price: price,
            artImage: artImage,
            description: description,
            tokenId: tokenId,
            owner: owner
        })

        users.save()
            .then((result) => {
                console.log("result", result)
                if (result) {
                    console.log("++++++------------", result)
                    return res.json({ status: true, message: "Image uploaded successfull.", data: result })
                }
            }).catch((err) => {
                console.log("err", err)
                return res.json({ status: false, message: "Image upload failed." })

            }
            )


    };

    getTokenID(req, res) {
        Usersmodal.countDocuments().then((tokenId) => {
            console.log('========res', tokenId)
            res.json({ status: true, message: "All Id Fetched", data: tokenId++ })
        }).catch((errr) => {
            console.log("===errr", errr)
        })

    }

    getalldata = (req, res) => {
        Usersmodal.find().then((result) => {
            console.log("results", result)
            return res.json({ status: true, message: "data fetched", data: result })
        }).catch((errrs) => {
            console.log("err", errrs)
        })
    }

    getSingleData = (req, res) => {
        const { tokenId } = req.body
        console.log('requestbody', tokenId)
        Usersmodal.findOne({ tokenId: tokenId })
            .then((singledata) => {
                console.log('single data', singledata)
                return res.json({ status: true, message: "data fetched.", data: singledata })
            })
            .catch((err) => {
                console.log('error', err)
            })
    }

    getEtherAdd = (req,res) => {
    const ethadd = process.env.PRIVATE_KEY
        console.log("addressEther",ethadd)
    }



}

module.exports = new Users()
