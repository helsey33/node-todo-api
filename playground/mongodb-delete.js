const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    //delete many
    db.collection('Users').deleteMany({name:'Himanshu'});

    db.collection('Users').findOneAndDelete({place:'Jamshedpur'}).then((result)=>{
        console.log(JSON.stringify(result,undefined,2));
    })

    db.close();
})