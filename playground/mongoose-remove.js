const {ObjectID} = require('mongodb');
const {mongoose} = require('./../db/mongoose');
const {Todo} = require('./../models/todo');

var id = '5a41a40ef305751a98110df4';

Todo.remove({}).then((result) => {
    console.log(result);
});

Todo.findOneAndRemove({}).then((doc) => {
    console.log(doc);
});

Todo.findByIdAndRemove(id).then((doc) => {
    console.log(doc);
});

Todo.findOneAndRemove({}).then((doc) => {
    console.log(doc)
});