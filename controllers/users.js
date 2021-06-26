const Usersmodal = require("../modals/users");
const Paymentmodal = require("../modals/Paymentmodal");
const Registermodal = require("../modals/register");
const Biddingmodal = require("../modals/bidding");
// const Tokennotlistusermodel = require('../modals/tokennotlistmodel');
// const Tokendetailsmodal = require('../modals/tokendetails');
const assetabi = require("../abis/assets.json");
const ethers = require("ethers");
const jwt = require("jsonwebtoken");
const ipfsAPI = require("ipfs-api");
const fs = require("fs");
const bcrypt = require("bcrypt");
const Mongoose = require("mongoose");
const Web3 = require("web3");
const axios = require("axios");
require("dotenv").config();
const ipfs = ipfsAPI("ipfs.infura.io", "5001", { protocol: "https" });
const saltRounds = 10;
const ethNetwork = "https://data-seed-prebsc-1-s1.binance.org:8545/";
const web3 = new Web3(new Web3.providers.HttpProvider(ethNetwork));
const EthereumTx = require("ethereumjs-tx").Transaction;
//const { bnbClient } = require("@binance-chain/javascript-sdk")
const { BncClient } = require("@binance-chain/javascript-sdk");

const baseURL = "https://testnet-dex.binance.org";
const net = "testnet";
const Common = require("@ethereumjs/common");

httpClient = axios.create({
  baseURL: baseURL + "/api/v1",
  contentType: "application/json",
});

bnbClient = new BncClient(baseURL);
bnbClient.chooseNetwork(net);
bnbClient.initChain();

class Users {
  NftOwnerAuxList(req, res) {
    const { nftTokenId } = req.body;
    console.log("req.body", nftTokenId);
    Biddingmodal.find({ nftTokenId: nftTokenId })
      .then((allAuxusers) => {
        console.log("all users bid for owner nft", allAuxusers);
        if (allAuxusers) {
          return res.json({
            status: true,
            message: "All user for Auctions ",
            AucUserlist: allAuxusers,
          });
        } else {
          return res.json({
            status: false,
            message: "Auc Users list not found",
          });
        }
      })
      .catch((err) => {
        console.log("catch block", err);
        return res.json({
          status: false,
          message: "Auc Users list not found",
          error: err,
        });
      });
  }

  placeAuction(req, res) {
    const { nftTokenId, bidPrice, email } = req.body;
    const dateAndTime = new Date().getTime();
    console.log(
      "Auction",
      nftTokenId,
      bidPrice,
      email,
      dateAndTime,
      req.currentuser._id
    );
    let bidObj = {
      email: email,
      nftTokenId: nftTokenId,
      tokenBidPrice: bidPrice,
      bidTime: dateAndTime,
      userId: Mongoose.Types.ObjectId(req.currentuser._id),
    }
    Biddingmodal.create(bidObj).then((data) => {
      return res.json({
        status: true,
        message: "Bid details saved",
        data: data,
      });
    }).catch((err)=>{
      return res.json({
        status: false,
        message: "Bid details not saved",
        data: err.description,
      });    
    })
    
  }

  checkUserAuc(req, res) {
    const { nftTokenId, email } = req.body;
    console.log("req.body", nftTokenId, email);
    Biddingmodal.findOne({ email: email ,nftTokenId: nftTokenId })
      .then((resp) => {
        console.log("resp", resp);
        if (resp) {
          return res.json({
            status: true,
            message: "This email and Nft Token already exists",
            data: resp,
          });
        } else {
          return res.json({
            status: false,
            message: "Email and Nft not found",
          });
        }
      })
      .catch((error) => {
        console.log("err catch block", err);
        return res.json({
          status: false,
          message: "Something went wrong ,Try again",
        });
      });
  }

  cancelAuc(req, res) {
    const { email, nftTokenId } = req.body;
    Biddingmodal.findOneAndDelete(
      { email: email, nftTokenId: nftTokenId })
      .then((deleteddata) => {
        console.log("deleted data", deleteddata);
        if (deleteddata) {
          return res.json({ status: true, message: "Data deleted" });
        } else {
          return res.json({ status: false, message: "Data not deleted" });
        }
      })
      .catch((error) => {
        console.log("err", error);
        return res.json({ status: false, message: "Data not deleted" });
      });
  }

  placeBid(req, res) {
    const { nftTokenId, bidPrice, bidtime, email } = req.body;
    console.log("=========", nftTokenId, bidPrice, bidtime);
    Usersmodal.findOne({ email: email })
      .then((resp) => {
        if (resp) {
          console.log("resp value in bid api", resp);
          Usersmodal.findOne({ nftTokenId: nftTokenId })
            .then((respvalue) => {
              console.log("find by nfttoken id resp", respvalue);
              if (respvalue) {
                return res.json({
                  status: false,
                  message: "You have already placed bid for this nft token.",
                });
              } else {
                Usersmodal.findOneAndUpdate(
                  { tokenId: nftTokenId },
                  {
                    $set: {
                      price: bidPrice,
                      listingtype: "Listed",
                      sellingtype: "Auction",
                      bidtime: bidtime,
                      soldStatus : '0'
                    },
                  },
                  { new: true }
                )
                  .then((updatedvalue) => {
                    console.log("updated value", updatedvalue);
                    return res.json({
                      status: true,
                      message:
                        "Price updated and bidding details saved for your another nft ",
                      updatedData: updatedvalue,
                    });
                  })
                  .catch((errs) => {
                    console.log("error", errs);
                    return res.json({
                      status: false,
                      message: "Value not updated",
                      Error: errs,
                    });
                  });
              }
            })
            .catch((errors) => {
              console.log("error nfttokenid catch block", errors);
              return res.json({
                status: false,
                message: "Error,try again",
                Error: errors,
              });
            });
        } else {
          Usersmodal.findOneAndUpdate(
            { tokenId: nftTokenId },
            {
              $set: {
                price: bidPrice,
                listingtype: "Listed",
                sellingtype: "Auction",
                bidtime: bidtime,
              },
            },
            { new: true }
          )
            .then((updatedvalue) => {
              console.log("updated value", updatedvalue);
              return res.json({
                status: true,
                message: "Price updated and bidding details saved",
                updatedData: updatedvalue,
              });
            })
            .catch((errs) => {
              console.log("error", errs);
              return res.json({
                status: false,
                message: "Value not updated",
                Error: errs,
              });
            });
        }
      })
      .catch((err) => {
        console.log("====err", err);
        res.json({ status: false, message: "Something went wrong ,check db" });
      });
  }

  generateAssets(req, res) {
    const {
      assetName,
      price,
      description,
      tokenId,
      owner,
      ipfsHash,
      email,
      username,
    } = req.body;
    console.log("req.body uploadimage", req.body, req);
    const users = new Usersmodal({
      assetName: assetName,
      price: price,
      ipfsHash: ipfsHash,
      description: description,
      tokenId: tokenId,
      owner: owner,
      email: email,
      username: username,
    });
    users
      .save()
      .then((result) => {
        return res.json({
          status: true,
          message: "Image uploaded successfull.",
          data: result,
        });
      })
      .catch((err) => {
        console.log("erro in saving data", err);
        return res.json({ status: false, message: "Image upload failed." });
      });
  }

  tokenDetails(req, res) {
    const { assetName, description, tokenId, ipfsHash } = req.body;
    console.log("req.body", assetName, description, tokenId, ipfsHash);
    Tokendetailsmodal.findOne({ tokenId: tokenId })
      .then((respvalue) => {
        console.log("response of findone----------", respvalue);
        if (respvalue) {
          return res.json({ status: false, message: "TokenId already used" });
        } else {
          let tokendetailObj = new Tokendetailsmodal({
            assetName: assetName,
            ipfsHash: ipfsHash,
            description: description,
            tokenId: tokenId,
          });

          tokendetailObj
            .save()
            .then((respdata) => {
              console.log("savedetails======", respdata);
              return res.json({
                status: true,
                message: "Token details",
                Tokendetails: respdata,
              });
            })
            .catch((errors) => {
              console.log("save error block", errors);
              return res.json({
                status: false,
                message: "Error, details not available",
                Error: errors,
              });
            });
        }
      })
      .catch((err) => {
        console.log("error", err);
        return res.json({ status: false, message: "Error", Error: err });
      });
  }

  getTokenDetails(req, res) {
    const tokenId = req.params.id;
    console.log(tokenId);
    Usersmodal.findOne({ tokenId: tokenId })
      .then((respon) => {
        console.log("respon=====>", respon);
        res.json({
          name: respon.assetName,
          image: respon.ipfsHash,
          description: respon.description,
          id: respon.tokenId,
        });
      })
      .catch((errs) => {
        console.log("respon=====>", errs);
        count;
      });
  }

  userHistory(req, res) {
    const { email } = req.body;
    console.log("current user========>", req.currentuser, email);
    Usersmodal.find({ email: email })
      .then((respdetail) => {
        console.log("resdata====+++++++", respdetail);
        return res.json({
          status: true,
          message: "User full details",
          userdetails: respdetail,
        });
      })
      .catch((errror) => {
        console.log("error", errror);
        return res.json({
          status: false,
          message: "No data available",
          error: errror,
        });
      });
  }

  getotherUserData(req, res) {
    const { email } = req.body;

    Usersmodal.find({ email: email })
      .then((respdetail) => {
        console.log("resdata====+++++++", respdetail);
        return res.json({
          status: true,
          message: "User full details",
          userdetails: respdetail,
        });
      })
      .catch((errror) => {
        console.log("error", errror);
        return res.json({
          status: false,
          message: "No data available",
          error: errror,
        });
      });
  }

  getTokenID(req, res) {
    Usersmodal.countDocuments()
      .then((count) => {
        console.log("========count", count);
        var tokenID = ++count;
        return res.json({
          status: true,
          message: "All Id Fetched",
          data: tokenID,
        });
      })
      .catch((errr) => {
        res.json({
          status: false,
          message: "Something went wrong,TokenId not fetched",
        });
      });
  }

  updateListedTable = (req, res) => {
    console.log("req.body", req.body);
    const { id, status } = req.body;
    var data_status;
    if (status === "Not-Hidden") data_status = 1;
    else data_status = 0;

    Usersmodal.findOneAndUpdate(
      { _id: Mongoose.Types.ObjectId(id) },
      { $set: { hide: status, status: data_status } },
      { new: true }
    )
      .then((updatedData) => {
        console.log("updatedData", updatedData);
        res.json({
          status: true,
          message: " status updated",
          data: updatedData,
        });
      })
      .catch((errors) => {
        console.log("errors===", errors);
      });
  };

  updatePrice(req, res) {
    const { tokenId, price } = req.body;
    console.log("req.body", req.body);
    Usersmodal.findOneAndUpdate(
      { tokenId: tokenId },
      { $set: { price: price, listingtype: "Listed", sellingtype: "Direct" , 'soldStatus' : '0'} },
      { new: true }
    )
      .then((updatedvalue) => {
        console.log("updated value", updatedvalue);
        return res.json({
          status: true,
          message: "Price updated",
          updatedData: updatedvalue,
        });
      })
      .catch((errs) => {
        console.log("error", errs);
        return res.json({
          status: false,
          message: "Value not updated",
          Error: errs,
        });
      });
  }

  cancelListing(req, res) {
    const { tokenId } = req.body;
    Usersmodal.findOneAndUpdate(
      { tokenId: tokenId },
      {
        $set: {
          price: null,
          listingtype: "Not-Listed",
          sellingtype: "",
          bidtime: "",
        },
      },
      { new: true }
    )
      .then((updatedvalue) => {
        console.log("updated value", updatedvalue);
        return res.json({
          status: true,
          message: "Removed from list",
          updatedData: updatedvalue,
        });
      })
      .catch((errs) => {
        console.log("error", errs);
        return res.json({
          status: false,
          message: " List not updated",
          Error: errs,
        });
      });
  }

  updatecouter = (req, res) => {
    const { id } = req.body;
    console.log("req.body update counter", id);
    Usersmodal.findOneAndUpdate(
      { _id: Mongoose.Types.ObjectId(id) },
      { $inc: { count: 1 } },
      { new: true }
    )
      .then((result) => {
        console.log("updated data", result);
      })
      .catch((err) => {
        console.log("updated data", result);
      });
  };

  getalldata = (req, res) => {
    Usersmodal.find({ listingtype: "Listed" })
      .sort({ count: -1 })
      .then((result) => {
        return res.json({
          status: true,
          message: "data fetched",
          data: result,
        });
      })
      .catch((errrs) => {
        res.json({
          status: false,
          message: "Something went wrong,data not available",
        });
      });
  };

  getalldataforAdmin = (req, res) => {
    Usersmodal.find()
      .then((result) => {
        return res.json({
          status: true,
          message: "data fetched",
          data: result,
        });
      })
      .catch((errrs) => {
        res.json({
          status: false,
          message: "Something went wrong,data not available",
        });
      });
  };

  // getallnotlisteddata = (req, res) => {
  //     console.log("getallnonlisteddata")
  //     Tokennotlistusermodel.find().then((result) => {
  //         console.log("list====", result)
  //         return res.json({ status: true, message: "All data fetched successfully.", data: result })
  //     }).catch((errs) => {
  //         console.log("errr", errs)
  //         res.json({ status: false, message: "Something went wrong,data not available" })
  //     })
  // }

  getSingleData = async (req, res) => {
    const { tokenId } = req.body;
     Usersmodal.findOne({ tokenId: tokenId })
      .then(async (singledata)  => {
        console.log("single data details", singledata);
        if(singledata.sellingtype === 'Auction' && singledata.soldStatus === '0'){
          await this.bidtimedifference(singledata);
        }
        return res.json({
          status: true,
          message: "data fetched.",
          data: singledata,
        });
      })
      .catch((err) => {
        res.json({
          status: false,
          message: "Something went wrong,this token data is not found",
        });
      });
  };

  async bidtimedifference(data) {
    let todaytime = new Date().getTime();
    let bidexacttime = new Date(data.bidtime).getTime();
    let objId;
    let email;
    let maxPrice;
    var highest = Number.NEGATIVE_INFINITY;

    if (parseInt(todaytime) > parseInt(bidexacttime) && data.soldStatus === "0") {

      console.log("else========biddifference", todaytime, bidexacttime, data);
      Biddingmodal.find({ nftTokenId: data.tokenId })
        .then((resp) => {
          console.log("response", resp);
          for (var i = resp.length - 1; i >= 0; i--) {
            maxPrice = resp[i].tokenBidPrice;
            if (maxPrice > highest) {
              highest = maxPrice;
              objId = resp[i]._id;
              email = resp[i].email;
            }
          }
          console.log("max price==========", highest, objId, email);
          Biddingmodal.updateMany({ nftTokenId: data.tokenId },{ status: "NOT-WIN" })
            .then((updatedvalue) => {
              console.log("=====", updatedvalue,objId);
              var user_id = objId;
              Biddingmodal.findByIdAndUpdate(user_id, { status: "WIN" })
                .then((updatedData) => {
                  console.log("updatedData", updatedData);
                })
                .catch((er) => {
                  console.log("er", er);
                });
            })
            .catch((errs) => {
              console.log("errs===", errs);
            });
        })
        .catch((err) => {
          console.log("errr", err);
        });
    } else {
      
    }
  }

  payDetails = async (req, res) => {
    // console.log('requestbody_paydetails', req.body);
    const {
      assetName,
      tokenId,
      newOwnerAddrs,
      boughtTokenHash,
      tokenPrice,
      toemail,
      tousername,
    } = req.body;
    const provider = new ethers.providers.JsonRpcProvider(
      "https://data-seed-prebsc-1-s1.binance.org:8545/"
    );
    const privatekey = process.env.TOKENOWNER_PRIVATEKEY;
    const wallet = new ethers.Wallet(privatekey, provider);
    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      assetabi,
      wallet
    );

    Usersmodal.findOne({ tokenId: tokenId })
      .then((tokenresp) => {
        console.log("ssssss", tokenresp);
        contract
          .transferFrom(tokenresp.owner, newOwnerAddrs, tokenId,)
          .then(async (respdata) => {
            console.log("value fromtransferfrom=============", respdata);
            if (respdata.hash) {
              const valueineth = web3.utils.fromWei(
                respdata.gasPrice.toString(),
                "ether"
              );
              const gaslimit = parseInt(respdata.gasLimit);
              const transfees = valueineth * gaslimit;

              var platformfees = parseFloat(tokenPrice) / 100; //platform fee 1%

              console.log("pricesss.",tokenPrice, "  ",platformfees, "  ",transfees);
              var amtafterfees =
                parseFloat(tokenPrice) - (platformfees + transfees);

              console.log("amt after fee", amtafterfees);
              var nonce = await web3.eth.getTransactionCount(
                process.env.TOKENOWNER_PUBLICKEY,
                "pending"
              );

              try {
                let details = {
                  to: tokenresp.owner,
                  value: web3.utils.toWei(amtafterfees.toString(), "ether"),
                  gas: 21000,
                  nonce: nonce,
                };

                const createTransaction =
                  await web3.eth.accounts.signTransaction(
                    details,
                    process.env.TOKENOWNER_PRIVATEKEY
                  );

                // Send Tx and Wait for Receipt
                const createReceipt = await web3.eth.sendSignedTransaction(
                  createTransaction.rawTransaction
                );
                console.log(
                  `Transaction successful with hash: ${createReceipt.transactionHash}`
                );

                if (createReceipt.transactionHash) {
                  let paydetails = new Paymentmodal({
                    assetName: assetName,
                    tokenId: tokenId,
                    tonewOwnerAddrs: newOwnerAddrs,
                    contractAddrs: process.env.CONTRACT_ADDRESS,
                    boughtTokenHash: boughtTokenHash,
                    transferTokenHash: respdata.hash,
                    tokenPrice: tokenPrice,
                    fromAddrs: tokenresp.owner,
                    transactionfee: transfees,
                    platformfees: platformfees,
                    amtSendToTokenOwner: amtafterfees,
                    etherSentTransId: createReceipt.transactionHash,
                  });

                  paydetails.save().then(async (saveddata) => {
                    Usersmodal.findOneAndUpdate(
                      { tokenId: tokenId },
                      {
                        soldStatus: 1,
                        newOwnerAddrress: newOwnerAddrs,
                        price: tokenPrice,
                        owner: newOwnerAddrs,
                        email: toemail,
                        username: tousername,
                        listingtype: "Not-Listed",
                        sellingtype: "",
                      },
                      { new: true }
                    )
                      .then((respo) => {
                        return res.json({
                          status: true,
                          message: "Transection successfull,data saved.",
                          data: saveddata,
                        });
                      })
                      .catch((errss) => {
                        console.log("errss");
                        return res.json({
                          status: false,
                          message:
                            " Something went wrong buying token,contact admin",
                        });
                      });
                  });
                } else {
                  console.log("createReceipt exception", createReceipt);
                  return res.json({
                    status: false,
                    message: createReceipt,
                  });
                }
              } catch (exception) {
                console.log("exception e", exception);
                return res.json({ status: false, message: exception });
              }
            } else {
              return res.json({
                status: false,
                message: "Transection failed,try again.",
              });
            }
          })
          .catch((errrs) => {
            console.log("errrs===", errrs);
            return res.json({
              status: false,
              message: "Transection failed! Something went wrong try again.",
            });
          });
      })
      .catch((errors) => {
        console.log("errorsfromtoken_findone block", errors);
      });
  };

  register = (req, res) => {
    // console.log('req.body_register', req.body)
    const { userName, email, password, confirmPass } = req.body;
    if (password !== confirmPass) {
      res.json({ status: false, message: "Confirm Password didn't match" });
    } else {
      Registermodal.findOne({ email: email })
        .then(async (respdata) => {
          // console.log(respdata)
          if (respdata) {
            res.json({ status: false, message: "User already exist" });
          } else {
            var newuser = new Registermodal({
              userName: userName,
              email: email,
              password: await bcrypt.hashSync(password, saltRounds),
              confirmPass: confirmPass,
            });

            newuser.save().then((resps) => {
              // console.log("=====", resps)
              if (resps) {
                res.json({
                  status: true,
                  message: "Registered Successfull,Data saved",
                });
              } else {
                res.json({
                  status: false,
                  message: "Registration failed,Data not saved.",
                });
              }
            });
          }
        })
        .catch((errs) => {
          console.log("findOne_catchblock", errs);
          res.json({
            status: false,
            message: "Something went wrong,try again",
          });
        });
    }
  };

  login = (req, res) => {
    const { email, password } = req.body;
    console.log("request-body", email, password);
    Registermodal.findOne({
      email: email,
      userType: parseInt(req.body.userType),
    })
      .then(async (respp) => {
        if (respp) {
          const match = await bcrypt.compare(password, respp.password);
          if (match) {
            var token = jwt.sign(
              { email: respp.email },
              process.env.SECRETKEY_JWT
            );
            console.log("findone-response", token, respp._id);
            var myquery = { email: email };
            var newvalues = { $set: { token: token } };
            Registermodal.findOneAndUpdate(
              { email: email },
              { $set: { token: token } },
              { new: true }
            )
              .then((respo) => {
                console.log("========respo after login", respo);

                res.json({
                  status: true,
                  message: "Login successful.",
                  data: respo,
                });
              })
              .catch((error) => {
                res.json({ status: false, message: error });
              });
          } else {
            res.json({
              status: false,
              message: "email and password is incorrect",
            });
          }
        } else {
          res.json({ status: false, message: "User not found" });
        }
      })
      .catch((errss) => {
        res.json({ status: false, message: "Something went wrong,try again" });
        // console.log('errss_catchblock', errss)
      });
  };

  alluserregistered(req, res) {
    Registermodal.find()
      .then((users) => {
        console.log("alluser", users);
        return res.json({
          status: true,
          message: "All users details",
          allusers: users,
        });
      })
      .catch((err) => {
        console.log("error", err);
        return res.json({ status: false, message: "Users Not found" });
      });
  }

  // tokennotlisted = (req, res) => {
  //     const { assetName, price, description, tokenId, owner, ipfsHash, email,username } = req.body
  //     console.log("==========", req.body)

  //     const notlistedusers = new Tokennotlistusermodel({
  //         assetName: assetName,
  //         price: price,
  //         ipfsHash: ipfsHash,
  //         description: description,
  //         tokenId: tokenId,
  //         owner: owner,
  //         email: email,
  //         username:username
  //     })
  //     notlistedusers.save().then((saveddata) => {
  //         console.log("saveddata====", saveddata)
  //         if (!saveddata) {
  //             return res.json({ status: "false", message: "Details not saved." })
  //         } else {
  //             return res.json({ status: "true", message: "Details saved.", data: saveddata })
  //         }
  //     }).catch((errors) => {
  //         console.log("errors", errors)
  //     })

  // }

  // sellerdata = (req, res) => {
  //     const totalPrice ;
  //     const exchangePrice;
  //     const tokenBuyingPrice;

  //     const { sellingPrice } = req.body
  //     const

  // }
}

module.exports = new Users();
