const grpc = require('grpc');
const fs = require('fs');
const ByteBuffer = require('bytebuffer');

process.env.GRPC_SSL_CIPHER_SUITES = 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES128-SHA256';
const lndCert = fs.readFileSync('/home/android-m8d8y15/.lnd/tls.cert');
const creds = grpc.credentials.createSsl(lndCert);
const lnrpcDesc = grpc.load('./rpc.proto');
const lnrpc = lnrpcDesc.lnrpc;

const lightning = new lnrpc.Lightning('localhost:10009', creds);

var call = lightning.sendPayment({})
call.on('data', function(msg) { console.log('Payment', msg) })
call.write({ payment_request: '0a3115b4cfbb3d049bda3dc82e11cb54f5a7ee9a' })