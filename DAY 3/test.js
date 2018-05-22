const Transaction = require('./Transaction')

let transaction = new Transaction(
    "c3293572dbe6ebc60de4a20ed0e21446cae66b17",
    "f51362b7351ef62253a227a77751ad9b2302f911",
    25000,
    10,
    "2018-02-10T17:53:48.972Z",
    "Send to Bob",
    "c74a8458cd7a7e48f4b7ae6f4ae9f56c5c88c0f03e7c59cb4132b9d9d1600bba1"
);
transaction.calculateTransactionHash()
transaction.sign('7e4670ae70c98d24f3662c172dc510a085578b9ccc717e6c2f4e547edd960a34')
console.log(transaction.senderSignature)

const verification = transaction.verify()
console.log(verification)