const {ObjectID} = require('mongodb');
const {mongoose} = require('./../db/mongoose');
const {Todo} = require('./../models/todo');

var id = '5a4129b3a60f6115cf06142111';

if(!ObjectID.isValid(id)){
    console.log("ID is invalid");
}

Todo.find({
    _id: id,
}).then((todos) => {
    console.log(todos);
});

Todo.findOne({
    _id: id,
}).then((todos) => {
    console.log(todos);
});

Todo.findById(id).then((todoById) => {
    console.log(todoById);
}).catch((err) => {
    console.log(err);
})