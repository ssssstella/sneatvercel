const{ MongoClient } = require('mongodb');

const MONGODB_URL = "mongodb+srv://admin:sneat123@cluster0.ea14pao.mongodb.net/?retryWrites=true&w=majority";

let client = new MongoClient(MONGODB_URL);

// Add Express
const express = require("express");
// Initialize Express
const app = express();
// Create GET request
app.get("/", (req, res) => {
  res.send("Express on Vercel");
});


app.get("/center", (req, res) => {
    res.send("this is my center route");
  });

  async function run() {
    try {
        const db = client.db("sample_mflix");
 
        const movies = await db
            .collection("movies")
            .find({})
            .sort({ metacritic: -1 })
            .limit(10)
            .toArray();
        
        app.get('/movies', async (req, res) => {
            res.json(movies);
        });
 
        
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
      }
    }
    run().catch(console.dir);


// Initialize server
app.listen(8080, () => {
  console.log("Server running on port 8080.");
});

module.exports = app;