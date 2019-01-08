const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const mongo_url = 'mongodb://127.0.0.1:27017';

let users = [
    {
        id : 1,
        name: 'alice'
    },
    {
        id : 2,
        name: 'bek'
    },
    {
        id : 3,
        name: 'chris'
    }
];

exports.index = (req, res) => {
    //res.json(users)
    MongoClient.connect(mongo_url, { useNewUrlParser: true })
        .then(client => {
            console.log('connected')
            const db = client.db('my-db');
            const collection = db.collection('post');
            collection.find().toArray()
                .then(response => res.status(200).json(response))
                .catch(error => console.error(error));
        });
};

exports.show = (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!id){
        return res.status(400).json({error:'Incorrect id'});
    }

    MongoClient.connect(mongo_url, { useNewUrlParser: true }).
        then(client => {
            const db = client.db('my-db');
            const collection = db.collection('post');
            collection.find({"id" : id}).toArray()
                .then(response => res.status(200).json(response))
                .catch(error => console.error(error))
    });
};

exports.destroy = (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!id) {
        return res.status(400).json({error: 'Incorrect id'});
    }

    const userIdx = users.findIndex(user => user.id === id);
    if (userIdx === -1) {
        return res.status(404).json({error: 'Unknown user'});
    }

    users.splice(userIdx, 1);
    res.status(204).send();
};

exports.create = (req, res) => {
    const name = req.body.name || '';
    if (!name.length) {
        return res.status(400).json({error: 'Incorrenct name'});
    }

    const id = users.reduce((maxId, user) => {
        return user.id > maxId ? user.id : maxId
    }, 0) + 1;

    const newUser = {
        id: id,
        name: name
    };
    users.push(newUser);

    return res.status(201).json(newUser);
};