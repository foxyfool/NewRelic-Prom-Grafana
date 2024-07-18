require("newrelic");

const express = require("express");

const app = express();

app.get("/", (req, res) => {
  console.log("route hit");
  res.json({ message: "hi there" });
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
