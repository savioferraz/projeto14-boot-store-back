import mongo from "../db/db.js";
import { ObjectId } from "mongodb";
import { getSession } from "./userControllers.js";
import { getProductById } from "./productsController.js";

const db = await mongo();

async function getChartItens(req, res) {
  try {
    const session = await getSession();

    if (!session) {
      return res.status(404);
    }
    const chart = session.chart;
    let chartItems = [];

    let chartTotalPrice = 0;

    for (let i = 0; i < chart.length; i++) {
      let element = chart[i];

      let productFound = await getProductById(element.product_id);
      let finalPrice = productFound.price * element.amount;
      let item = {
        product: productFound.product,
        img: productFound.img,
        price: productFound.price,
        amount: element.amount,
        finalPrice: finalPrice,
      };
      chartItems.push(item);
      chartTotalPrice += finalPrice;
    }
    res.locals.totalPrice = chartTotalPrice;
    console.log(res.locals.totalPrice);
    return res.send(chartItems);
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
}

async function deleteChartItem(req, res) {
  const { id } = req.body;

  try {
    const session = await getSession();
    if (!session) {
      return res.status(404);
    }
    const chart = session.chart;
    const filtered = chart.filter(function (value) {
      return value.product_id !== id;
    });

    if(filtered.length === chart.length){ // se as listas tiverem tamanhos iguais significa que o id procurado para deletar não existe
        return res.status(404);
    }
    const result = await db
      .collection("sessions")
      .updateOne(
        { _id: session._id }, //filter
        { $set: { chart: filtered } },//value to update
        { upsert: false }
      );
    
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
}

export { getChartItens, deleteChartItem };
