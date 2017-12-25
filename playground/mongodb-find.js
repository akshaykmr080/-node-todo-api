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
    
    // var data = db.collection('Todos').find({
    //     _id: new ObjectID('5a406fa1cd01dd081ee5e44f')
    // }).toArray().then((docs) => {
    //     console.log('TodoApp');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Unable to fetch records ',err);
    // }) 

    db.collection('Todos').find().count().then((count) => {
        console.log(`Todos count ${count}`)
    })
    client.close();
})