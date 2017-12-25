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
    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if(err){
    //         return console.log('Unable to insert TODO', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // })

    db.collection('Users').insertOne({
        name: 'Akshay Kumar Shreekanth',
        age: '24',
        location: 'Bengaluru'
    }, (err, result) => {
        if(err){
            return console.log('Unable to save user');
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
    })
    client.close();
})