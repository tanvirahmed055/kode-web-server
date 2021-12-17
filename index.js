const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors')
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express()
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oa9tu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();
        //database 
        const database = client.db("kodeWeb_Db");
        //collections
        const usersCollection = database.collection("users");
        const servicesCollection = database.collection("services");


        //GET API for getting all services
        app.get('/services', async (req, res) => {
            // query for services
            const query = {};

            const cursor = servicesCollection.find(query);
            // print a message if no documents were found
            if ((await cursor.count()) === 0) {
                console.log("No documents found!");
            }

            const result = await cursor.toArray();
            res.json(result);
        })


        //GET API for getting a service
        app.get('/service', async (req, res) => {

            const serviceId = req.query.id;
            console.log(serviceId);

            // Query for a service
            const query = { _id: ObjectId(serviceId) };

            const service = await servicesCollection.findOne(query);

            res.json(service);

        })

        //POST API for storing users on database
        app.post('/users', async (req, res) => {
            const user = req.body;

            console.log(user)

            const result = await usersCollection.insertOne(user);

            console.log(`A document was inserted with the _id: ${result.insertedId}`);

            res.json(result);

        })



    } finally {
        //await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Welcome to KodeWeb Server!')
})

app.listen(port, () => {
    console.log(`KodeWeb Server app listening at http://localhost:${port}`)
}) 