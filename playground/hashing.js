const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    id: 4
}

var token = jwt.sign(data, 'abc123');


var decoded = jwt.verify(token, 'abc123');

console.log('decoded data: '+JSON.stringify(decoded));
// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }

// token.data.id = 5;
// token.data.hash = SHA256(JSON.stringify(data)).toString();


// var resultHash = SHA256(JSON.stringify(token. data)+'somesecret').toString(); //hash + salt.     'somesecret' is the random string added



// if(resultHash === token.hash){
//     console.log('Data not modified')
// } else {
//     console.log('data has been modified')
// }