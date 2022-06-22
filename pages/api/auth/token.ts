import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { createToken } from "controllers/auth";
import { cors } from "lib/middlewares/cors";

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  const { email, code } = req.body;
  console.log("type of code", typeof code);

  if (!email || !code) {
    res.status(404).send({ message: "Email and code are needed." });
  }
  const result = await createToken(email, code);
  res.send({ result });
}

const handler = methods({
  post: postHandler,
});

export default handler;
