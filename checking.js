const Web3 = require('web3');

/*
   -- Define Provider & Variables --
*/
// Provider
const providerRPC = {
   development: 'http://localhost:9933',
   moonbase: 'https://rpc.testnet.moonbeam.network',
};
const web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545/"); //Change to correct network

const account_from = {
   privateKey: '067389e8d93ac09845d4d6633ca7c6ef4581a063dd11b2e3a38bace63cf23b3f',
   address: '0x1dC1f4b7959aB8955836282E28524DE41A9975Bd',
};
const addressTo = '0x06b639618826CE6882556e15b834E86913b3fDd9'; // Change addressTo

/*
   -- Create and Deploy Transaction --
*/
const deploy = async () => {
   console.log(
      `Attempting to send transaction from ${account_from.address} to ${addressTo}`
   );

   // Sign Tx with PK
   const createTransaction = await web3.eth.accounts.signTransaction(
      {
         gas: 21000,
         to: addressTo,
         value: web3.utils.toWei('.1', 'ether'),
      },
      account_from.privateKey
   );

   // Send Tx and Wait for Receipt
   const createReceipt = await web3.eth.sendSignedTransaction(
      createTransaction.rawTransaction
   );
   console.log(
      `Transaction successful with hash: ${createReceipt.transactionHash}`
   );
};

deploy();