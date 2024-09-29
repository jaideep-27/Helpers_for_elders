import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get all requests
router.get("/", async (req, res) => {
  let collection = await db.collection("help_requests");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

// Get a single request by id
router.get("/:id", async (req, res) => {
  let collection = await db.collection("help_requests");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);
  if (!result) res.status(404).send("Not found");
  else res.status(200).send(result);
});

// Create a new help request
router.post("/", async (req, res) => {
  try {
    let newRequest = {
      name: req.body.name,
      requestDescription: req.body.requestDescription,
      status: req.body.status || "Pending",
    };
    let collection = await db.collection("help_requests");
    let result = await collection.insertOne(newRequest);
    res.status(201).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating request");
  }
});

// Update a request by id
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        name: req.body.name,
        requestDescription: req.body.requestDescription,
        status: req.body.status,
      },
    };
    let collection = await db.collection("help_requests");
    let result = await collection.updateOne(query, updates);
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating request");
  }
});

// Delete a request by id
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const collection = db.collection("help_requests");
    let result = await collection.deleteOne(query);
    res.status(200).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting request");
  }
});

export default router;
