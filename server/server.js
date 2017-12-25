var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('../db/mongoose');
var {Todo} = require('../models/todo');
var {User} = require('../models/user');


var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    console.log(req.body);
    var newTodo = new Todo({
       text: req.body.text
    });

    newTodo.save().then((doc) => {
        console.log('Saved Todo ', doc);
        res.send(doc);
    }, (err) => {
         console.log('unable to save todo ',err);
         res.status(400).send(err);
    })
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (err) => {
    console.log('unable to save todo');
    res.status(400).send(err);
    })
})
app.listen(3000, () => {
    console.log('server started on port 3000')
})



// var newuser = new User({
//     email: 'akshay.kmr080@gmail.com'
// })
// var newTodoChallenge = new Todo({
//     text: 'feed dogs now      ',
//     completed: true,
//     completedAt: new Date().getMilliseconds()
// });

// newTodo.save().then((doc) => {
//     console.log('Saved Todo ', doc);
// }, (e) => {
//     console.log('unable to save todo')
// });

// newTodoChallenge.save().then((doc) => {
//     console.log('Saved Todo');
//     console.log(JSON.stringify(doc, undefined, 2));
// }, (e) => {
//     console.log('Unable to save Todo ',e)
// })

// newuser.save().then((doc) => {
//     console.log('user saved');
//     console.log(JSON.stringify(doc, undefined, 2));
// }, (err) => {
//     console.log('Unable to save user ', err);
// })