const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');
const _=require('lodash');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todos');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
   var todo = new Todo({
       text: req.body.text
   });

   todo.save().then((doc)=>{
       res.send(doc);
   },(e)=>{
       res.status(400).send(e);
   })
});

app.get('/todos',(req,res)=>{
    Todo.find().then((todos) => {
        res.send({todos});
    },(e)=>{
        res.status(400).send(e);
    });
});

app.get('/todos/:id',(req,res)=>{
    var id=req.params.id;
    if(!ObjectId.isValid(id))
        res.status(404).send('Not a valid id');
    Todo.findById(id).then((todo)=>{
        res.send({todo});
    },(e)=>{
        res.status(400).send();
    })
});

app.delete('/todos/:id',(req,res)=>{
    var id=req.params.id;
    if(!ObjectId.isValid(id))
        res.status(404).send();
    Todo.findByIdAndRemove(id).then((todo)=>{
        res.send(`Removed ${todo.text}`);
    },(e)=>{
        res.status(400).send();
    })
});

app.patch('/todos/:id',(req,res)=>{
    var id=req.params.id;
    var body = _.pick(req.body,['text','completed']);

    if (!ObjectId.isValid(id))
        res.status(404).send();

        if(_.isBoolean(body.completed) && body.completed){
            body.completedAt = new Date().getTime();
        }else{
            body.completed=false;
            body.completedAt=null;
        }

        Todo.findByIdAndUpdate(id, {$set:body}, {new:true}).then((todo)=>{
            if(!todo)
                return res.status(400).send();
            
            res.send({todo});
        }).catch((e)=>{
            res.status(400).send();
        })

});

app.post('/users',(req,res)=>{
    var body = _.pick(req.body,['email','password']);
    var user = new User(body);

    user.save().then(()=>{
        return user.generateAuthToken();
    }).then((token)=>{
        res.header('x-token',token).send(user);
    }).catch((e)=>{
        res.status(400).send(e);
    })
});

app.listen(port,()=>{
    console.log(`Started on port ${port}!`)
});