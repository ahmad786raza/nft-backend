const Usersmodal = require('../modals/users')




class Users {

    uploadImage(req, res, next) {
        const {assetName, price, description, tokenId, owner } = req.body
        const image = req.file
        console.log("req.body", image, req.body)
        if (!image) {
            return res.status(500).json({ message: 'image not found' })
        }

        const artImage = image.path;

        const users = new Usersmodal({
            assetName:assetName,
            price: price,
            artImage: artImage,
            description: description,
            tokenId: tokenId,
            owner:owner
        })

        users.save()
            .then((result) => {
                console.log("result",result)
                if (result) {
                    console.log("++++++------------",result)
                    return res.json({ status: true, message: "Image uploaded successfull.",data:result })
                }
            }).catch((err) => {
                console.log("err",err)
                return res.json({ status: false, message: "Image upload failed." })

            }
            )


    };

    getTokenID(req, res) {
        Usersmodal.countDocuments().then((tokenId) => {
            console.log('========res', tokenId)
            res.json({status:true,message:"All Id Fetched",data:tokenId++})
        }).catch((errr) => {
            console.log("===errr", errr)
        })

    }

    getalldata=()=>{
        Usersmodal.find().then((result)=>{
            console.log("results",result)
            return res.json({status:true,message:"data fetched",data:result})
        }).catch((errrs)=>{
            console.log("err",errrs)
        })
    }

}

module.exports = new Users()
