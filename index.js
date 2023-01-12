const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();


// MiddleWare
app.use(cors());
app.use(express.json());



// MongoDB

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.uzcobln.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// APIs
async function run() {
    try {
        await client.connect();
        const database = client.db("manufacturer_user")
        const toolscollection = database.collection("tools");

        // Inventory API
        app.get('/tools', async (req, res) => {
            const query = {};
            const cursor = toolscollection.find(query);
            const tools = await cursor.toArray();
            res.send(tools);
        });

        app.get('/tools/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const toolsItem = await toolscollection.findOne(query);
            res.send(toolsItem);
        });


    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);


// Port Listening
app.listen(port, () => {
    console.log('Listening to port', port);
});