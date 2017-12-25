//var MongoClient = require('mongodb').MongoClient;
//using destructuring in ES6

var {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();

console.log(obj);

MongoClient.connect('mongodb://localhost:27017', (error, client) => {
    if(error){
        return console.log('unable to connect to the mongoDB database');
    }
    console.log('Connected to mongo DB');
    var db = client.db('TodoApp');
    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5a4091f417948df3ce26873a')
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // }, {
    //     returnOriginal:false
    // }).then((result) => {
    //     console.log(result);
    // })

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5a4070d10d588d08477e0399')
    }, {
        $set: {
            name:'Vidhatri'
        },
        $inc: {
            age: -1
        }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log
    })
    
    client.close();
})