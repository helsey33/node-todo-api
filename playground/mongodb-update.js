const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    db.collection('Users').findOneAndUpdate({name:'Mikhail'},
    {
        $set:{
            name:'Himanshu'
        }
    },
    {
        returnOriginal:false
    }).then((res)=>{
        console.log(res);
    })

    db.close();
})