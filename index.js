const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

// MiddleWare
app.use(cors());
app.use(express.json());

// MongoDB

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.uzcobln.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// APIs
async function run() {
  try {
    await client.connect();
    const database = client.db("manufacturer_user");
    const toolscollection = database.collection("tools");
    const reviewscollection = database.collection("review");
    const profilecollection = database.collection("profileInfo");
    const jsAssignmentCollection = database.collection("Js Assignment");
    const reviewCollection = database.collection("Review");

    // Inventory API
    app.get("/tools", async (req, res) => {
      const query = {};
      const cursor = toolscollection.find(query);
      const tools = await cursor.toArray();
      res.send(tools);
    });

    app.post("/tools", async (req, res) => {
      const newtools = req.body;
      const result = await toolscollection.insertOne(newtools);
      res.send(result);
    });

    app.get("/tools/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const toolsItem = await toolscollection.findOne(query);
      res.send(toolsItem);
    });

    app.get("/reviews", async (req, res) => {
      const query = {};
      const cursor = reviewscollection.find(query);
      const review = await cursor.toArray();
      res.send(review);
    });

    app.post("/reviews", async (req, res) => {
      const newReview = req.body;
      const result = await reviewscollection.insertOne(newReview);
      res.send(result);
    });

    app.post("/profile", async (req, res) => {
      const newProfile = req.body;
      const result = await profilecollection.insertOne(newProfile);
      res.send(result);
    });

    app.get("/profile/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const profileUser = await profilecollection.findOne(query);
      res.send(profileUser);
    });

    // ========================================================

    // Course Review

    app.get("/review", async (req, res) => {
      const cursor = reviewCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/review", async (req, res) => {
      const reviewInfo = req.body;
      const result = await reviewCollection.insertOne(reviewInfo);
      res.send(result);
    });

    // Javascript Assignment
    app.get("/js-assignment", async (req, res) => {
      const cursor = jsAssignmentCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/js-assignment", async (req, res) => {
      const jsAssignment = req.body;
      const result = await jsAssignmentCollection.insertOne(jsAssignment);
      res.send(result);
    });
    
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

// Port Listening
app.listen(port, () => {
  console.log("Listening to port", port);
});
