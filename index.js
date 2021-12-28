const { MongoClient } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@janaalam.ewacz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("time_keeper");
    const productCollection = database.collection("products");
    const orderCollection = database.collection("orders");

    console.log("database connected");
    // get product
    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const products = await cursor.toArray();
      res.json(products);
    });

    // Order POST
    app.post("/order", async (req, res) => {
      const order = req.body;
      order.status = "pending";
      const result = await orderCollection.insertOne(order);
      res.json(result);
    });

    // above this
  } finally {
    // await client.connect();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.json({ message: "Server Running" });
});

app.listen(port, () => {
  console.log("listening on port", port);
});
