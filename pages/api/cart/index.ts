import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authMiddleware } from "lib/middlewares/authmiddleware";
import { addToCart, getCart } from "controllers/cart";
import { deleteItemFromCart } from "controllers/cart";

async function handlePost(req: NextApiRequest, res: NextApiResponse, token) {
  if (!req.body.id) {
    res.status(400).send({ Error: "product ID is  needed" });
  }
  const added = await addToCart(req.body.id, token);
  res.send({ added });
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse, token) {
  if (!req.body.id) {
    res.status(400).send({ Error: "Product's id is missing" });
  }
  const result = await deleteItemFromCart(req.body.id, token);
  res.send(result);
}

async function handleGet(req: NextApiRequest, res: NextApiResponse, token) {
  const result = await getCart(token);
  res.send(result);
}

const handler = methods({
  get: handleGet,
  post: handlePost,
  delete: handleDelete,
});

export default authMiddleware(handler);
