import { ObjectId } from "mongodb";
import mongo from "../db/db.js";
import { getUser } from "./userControllers.js";

const db = await mongo();

async function getProducts(req, res) {
  try {
    const products = await db.collection("products").find().toArray();
    const user = await getUser();

    if (!user) {
      return res.status(404);
    }
    res.locals.user = user;
    return res.send(products);
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
}

async function getProductById(id) {
  const product = await db
    .collection("products")
    .findOne({ _id: new ObjectId(id) });
  return product;
}

async function postProduct(req, res) {
  try {
    const product = req.body;

    await db.collection("products").insertOne(product);
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
}

export { getProducts, getProductById, postProduct };
