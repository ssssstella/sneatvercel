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

// Initialize server
app.listen(8080, () => {
  console.log("Server running on port 8080.");
});

module.exports = app;