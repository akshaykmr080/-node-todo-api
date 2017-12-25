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

    //deleteMany
    // db.collection('Todos').deleteMany({text:'Eat Lunch'}).then((result) => {
    //     console.log(result);
    // })
    
    //deleteAny
        // db.collection('Todos').deleteOne({text:'Eat Lunch'}).then((result) => {
        //     console.log(result)
        // })
    //finsOneAndDelete
        db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
            console.log(result);
        })
    //client.close();
})