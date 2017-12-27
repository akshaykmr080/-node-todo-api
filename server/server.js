require('../config/config');


var express = require('express');
var bodyParser = require('body-parser');
const lodash = require('lodash');

const {User} = require('../models/user');
const {ObjectID} = require('mongodb');
const {mongoose} = require('./../db/mongoose');
const {Todo} = require('./../models/todo');
var {authenticate} = require('./middleware/authenticate');
const port = process.env.PORT;

var app = express();

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
    console.log(req.body);
    var newTodo = new Todo({
       text: req.body.text,
       _creator: req.user._id
    });

    newTodo.save().then((doc) => {
        console.log('Saved Todo ', doc);
        res.send(doc);
    }, (err) => {
         console.log('unable to save todo ',err);
         res.status(400).send(err);
    })
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({todos});
    }, (err) => {
    console.log('unable to save todo');
    res.status(400).send(err);
    })
});

app.get('/todos/:id', authenticate, (req,res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        console.log("ID is invalid");
        res.status(404).send("invalid ID");
    }

    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todoById) => {
        console.log(todoById);
        if(!todoById) res.status(404).send("No todo object found")
        res.send({todoById});
    }).catch((err) => {
        console.log(err);
        res.send('Error occured')
    })
})


app.delete('/todos/:id', authenticate, (req,res) => {

    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        console.log("ID is invalid");
        return res.status(404).send("invalid ID");
    }
    console.log("hello");
    Todo.findOneAndRemove({
        _id:id,
        _creator: req.user._id
    }).then((todo) => {
        console.log(todo);
        if(!todo)  return res.status(404).send("No todo object found");

        return res.status(200).send({todo});
    }).catch((e)=> {
        return res.status(400).send();
    });
})

app.delete('/todos', (req,res) => {
    Todo.remove({
        _creator: req.user._id
    }).then((result) => {
        return res.status(200).send('All todos removed successfully');
    })
});


app.patch('/todos/:id', authenticate, (req, res) => {
    console.log("reached here");
    var id  = req.params.id;
    var body = lodash.pick(req.body, ['text','completed']);

    console.log(body)
    if(!ObjectID.isValid(id)){
        console.log("ID is invalid");
        return res.status(404).send("invalid ID");
    }

    if(lodash.isBoolean(body.completed) && body.completed){
        console.log("complted");
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({
         _id:id,
        _creator: req.user._id
    }, {$set:body}, {new: true}).then ((todo) => {
        if(!todo){
            return res.status(404).send()
        }
        return res.send({todo});
    }).catch((err) => {
        return res.status(400).send();
    })

})








//User routes 

//POST - user creation  /users
app.post('/users', (req, res) => {
    console.log(req.body);
    var body = lodash.pick(req.body, ['email','password']);
    console.log(body)
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) =>{
        res.header('x-auth',token).send(user.toJSON())
    }).catch((err) => {
        res.status(400).send(err);
    })
});




app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
})

app.post('/users/login', (req,res) => {
    var body = lodash.pick(req.body, ['email','password']);
    
    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) =>{
            res.header('x-auth',token).send(user);
        })
        //res.send(user);
    }).catch((err) => {
        res.status(400).send();
    })
});

app.delete('/users/me/token', authenticate, (req,res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send()
    }, (err) => {
        res.status(400).send();
    })
})


app.listen(port, () => {
    console.log('server started on port '+port);
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

module.exports = { app }