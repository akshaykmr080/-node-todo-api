const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');

const {Todo} = require('../../models/todo'); 
const {ObjectID} = require('mongodb');
const {User} = require('../../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed')

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = "Test todo text";

        request(app).
        post('/todos').
        set('x-auth', users[0].tokens[0].token).
        send({text}).
        expect(200).
        expect((res) => {
            expect(res.body.text).toBe(text);
        }).
        end((err, res) => {
            if(err){
                return done(err);
            }

            Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e) => {
                done(e);
            })
        });
    });

    it('should not create todo with invalid body data', (done) => {
        request(app).
        post('/todos').
        set('x-auth', users[0].tokens[0].token).
        send().
        expect(400).
        end((err, res) => {
            if(err) return done(err);

            Todo.find().then((todos) => {
                expect(todos.length).toBe(2);
                done();
            }).catch((e) => {
                done(e);
            })
        }).catch((e) => {
            done(e);
        })
    });


})

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app).
        get('/todos').
        set('x-auth', users[0].tokens[0].token).
        expect(200).
        expect((res) => {
            expect(res.body.todos.length).toBe(1);
        }). 
        end(done)
    })
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app).
        get(`/todos/${todos[0]._id.toHexString()}`).
        set('x-auth', users[0].tokens[0].token).
        expect(200).
        expect((res) => {
            expect(res.body.todoById.text).toBe(todos[0].text)
        }).
        end(done);
    });

    it('should return a 404 if todo not found', (done) => {
        request(app).
        get(`/todos/${new ObjectID('5a41a40ef305751a98110df5').toHexString()}`).
        set('x-auth', users[0].tokens[0].token).
        expect(404).
        end(done);
    });

    it('should return a 404 if invalid id is passed', (done) => {
        request(app).
        get(`/todos/1234`).
        set('x-auth', users[0].tokens[0].token).
        expect(404).
        end(done);
    });

    it('should not return todo doc created by another user', (done) => {
        request(app).
        get(`/todos/${todos[1]._id.toHexString()}`).
        set('x-auth', users[0].tokens[0].token).
        expect(404).
        end(done);
    });
});

describe('DELETE /todos/:id', () => {
    var hexId = todos[1]._id.toHexString();
    it('should remove a todo', (done) => {
        request(app).
        delete(`/todos/${hexId}`).
        set('x-auth', users[1].tokens[0].token).
        expect(200).
        expect((res) => {
            expect(res.body.todo._id).toBe(hexId);
        }). 
        end((err, res) => {
            if(err){
                return done(err);
            }

            Todo.findById(hexId).then((todo) => {
                expect(todo).toBeFalsy();
                done();
            }).catch((e) => {
                done(e);
            })
        });
    });

    it('should  not remove a todo if its created by another user', (done) => {
        request(app).
        delete(`/todos/${hexId}`).
        set('x-auth', users[0].tokens[0].token).
        expect(404). 
        end((err, res) => {
            if(err){
                return done(err);
            }

            Todo.findById(hexId).then((todo) => {
                expect(todo).toBeTruthy();
                done();
            }).catch((e) => {
                done(e);
            })
        });
    });

    it('should return a 404 if todo not found', (done) => {
        request(app).
        delete(`/todos/${hexId+1}`).
        set('x-auth', users[1].tokens[0].token).
        expect(404).
        end(done);
    });

    it('should return a 404 if invalid id is passed', (done) => {
        request(app).
        delete(`/todos/1234`).
        set('x-auth', users[0].tokens[0].token).
        expect(404).
        end(done);
    });
});

describe('PATCH /todos/:id', () => {
    var hexId = todos[0]._id.toHexString();
    it('should update the todo', (done) => {
        request(app).
        patch(`/todos/${hexId}`).
        set('x-auth', users[0].tokens[0].token).
        send({text:'updated text from test case', completed: true}).
        expect(200).
        expect((res) => {
            expect(res.body.todo.text).toBe('updated text from test case');
            expect(res.body.todo.completed).toBe(true);
            expect(typeof res.body.todo.completedAt).toBe('number');
        }).
        end(done);
    });

    it('should not update the todo created by other users', (done) => {
        request(app).
        patch(`/todos/${hexId}`).
        set('x-auth', users[1].tokens[0].token).
        send({text:'updated text and set completed to false', completed: false}).
        expect(404).
        end(done);
    });

    it('should clear completedAt when completed is not set', (done) => {
        request(app).
        patch(`/todos/${hexId}`).
        set('x-auth', users[0].tokens[0].token).
        send({text:'updated text and set completed to false', completed: false}).
        expect(200).
        expect((res) => {
            expect(res.body.todo.text).toBe('updated text and set completed to false');
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toBeFalsy();
        }).
        end(done);
    });
});

describe('GET /users/me' , () => {
    it('should return user if authenticated', (done)=> {
        request(app).
        get('/users/me').
        set('x-auth', users[0].tokens[0].token).
        expect(200).
        expect((res) => {
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
        }).
        end(done);
    });

    it('should resturn 401 if user is not authenticated', (done) => {
        request(app).
        get('/users/me').
        expect(401).
        expect((res) => {
            expect(res.body).toEqual({})
        }).
        end(done);
    })
});


describe('POST /users', () => {
    it('should create a user', (done) => {
        var email='mamatha@gmail.com';
        var password='abc1234';

        request(app).
        post('/users').
        send({email, password}).
        expect(200).
        expect((res) => {
            expect(res.headers['x-auth']).toBeTruthy();
            expect(res.body._id).toBeTruthy();
            expect(res.body.email).toBe(email);
        }).
        end((err, res) => {
            if(err){
                return done(err);
            }
            User.findOne({email}).then((user) => {
                expect(user).toBeTruthy();
                expect(user.password).not.toBe(password);
                done();
            })
        }).catch((err) => {
            done(err);
        })
    });

    it('should return validation errors if request is invalid', (done)=>{
        request(app).
        post('/users').
        send({email:'&', password:'aks'}).
        expect(400).
        end(done);
    });

    it('should not create user if email is in use', (done)=> {
        request(app).
        post('/users').
        send({email:'shreekan@usc.edu', password:'aks1234'}).
        expect(400).
        end(done);
    })
});

describe('POST /users/login', () => {
    it('should login user and return auth token', (done)=> {
        var email = users[1].email;
        var password = users[1].password;

        request(app).
        post('/users/login').
        send({email, password: password}).
        expect(200).
        expect((res) => {
            expect(res.headers['x-auth']).toBeTruthy();
        }).
        end((err, res) => {
            if(err) return done(err);

            User.findById(users[1]._id).then((user) => {
                expect(user.toObject().tokens[1]).toMatchObject({
                    access: 'auth',
                    token: res.headers['x-auth']
                });
                if(user)
                    done();

            }).catch((err) => {
                done(err);
            })
        })
    });

    it('should not login user', (done)=> {
        var email = users[1].email;
        var password = users[1].password+'abcd';
        request(app).
        post('/users/login').
        send({email, password}).
        expect(400).
        expect((res) => {
            expect(res.headers['x-auth']).toBeFalsy()
        }).
        end((err, res) => {
            if(err) done(err);

            User.findById(users[1]._id).then((user) => {
                expect(user.toObject().tokens.length).toBe(1);
                done();
            }).catch((err) => {
                done(err);
            })
        })
    });
});


describe('DELETE /users/me/token', () => {
    it('should remove auth token on logout', (done)=> {
        request(app).
        delete('/users/me/token').
        set('x-auth', users[0].tokens[0].token).
        expect(200).
        end((err, res) => {
            if(err) done(err);

            User.findById(users[0]._id).then((userData) => {
                console.log(JSON.stringify(userData, undefined, 2));
                expect(userData.tokens.length).toBe(0);
                done();
            }).catch((err) => {
                done(err);
            })
        })
    })
})