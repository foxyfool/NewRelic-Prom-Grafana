import express from "express";
import client from "prom-client";

import {
  metricsMiddleware,
  activeUserMiddleware,
  requestDurationMiddleware,
} from "./monitoring";

const app = express();

app.use(express.json());
app.use(metricsMiddleware);
app.use(activeUserMiddleware);
app.use(requestDurationMiddleware);

app.get("/metrics", async (req, res) => {
  const metrics = await client.register.metrics();
  res.set("Content-Type", client.register.contentType);
  res.end(metrics);
});

app.get("/user", (req, res) => {
  res.send({
    name: "John Doe",
    age: 25,
  });
});

app.post("/user", (req, res) => {
  const user = req.body;
  res.send({
    name: user.name,
    age: user.age,
    id: user.id,
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
