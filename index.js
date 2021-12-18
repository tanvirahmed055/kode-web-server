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
        const ordersCollection = database.collection("orders");
        const reviewsCollection = database.collection("reviews");


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

        //GET API for getting a userInfo
        app.get('/user', async (req, res) => {

            const email = req.query.email;
            console.log(email);

            // Query for a user
            const query = { email: email };

            const user = await usersCollection.findOne(query);

            res.json(user);

        })

        //POST API for storing orders on database
        app.post('/orders', async (req, res) => {
            const order = req.body;

            //console.log(order)

            const result = await ordersCollection.insertOne(order);

            console.log(`A document was inserted with the _id: ${result.insertedId}`);

            res.json(result);

        })

        //GET API for getting all orders of a specific user
        app.get('/orders', async (req, res) => {

            const email = req.query.email;
            //console.log(email);

            // Query for orders with this email
            const query = { email: email };

            const cursor = await ordersCollection.find(query);

            // print a message if no documents were found
            if ((await cursor.count()) === 0) {
                console.log("No documents found!");
            }
            // replace console.dir with your callback to access individual elements
            const result = await cursor.toArray();

            res.json(result);
        })

        //DELETE API for deleting a order
        app.delete('/deleteOrder/:id', async (req, res) => {

            const orderId = req.params.id;
            console.log(orderId);

            // Query for a order
            const query = { _id: ObjectId(orderId) };


            const result = await ordersCollection.deleteOne(query);

            if (result.deletedCount === 1) {
                console.log("Successfully deleted one document.");
            } else {
                console.log("No documents matched the query. Deleted 0 documents.");
            }

            res.json(result);

        })

        //GET API for getting all reviews
        app.get('/reviews', async (req, res) => {
            // query for reviews
            const query = {};

            const cursor = reviewsCollection.find(query);
            // print a message if no documents were found
            if ((await cursor.count()) === 0) {
                console.log("No documents found!");
            }

            const result = await cursor.toArray();
            res.json(result);
        })

        //POST API for adding a new review on database
        app.post('/addReview', async (req, res) => {
            const newReview = req.body;
            //console.log(newReview);


            const result = await reviewsCollection.insertOne(newReview);

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