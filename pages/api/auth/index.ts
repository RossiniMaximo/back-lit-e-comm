import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { sendCode } from "controllers/auth";
import { updatePassword } from "controllers/auth";
import { cors } from "lib/middlewares/cors";

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  if (!req.body) {
    res.status(400).send({ Error: "body missing" });
  }
  const { email, fullname, password } = req.body;
  const result = await sendCode(email, fullname, password);
  res.send({ result });
}

async function patchHandler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  if (!req.body) {
    res.status(400).send({ Error: "Body missing" });
  }
  const { email, password } = req.body;
  const result = await updatePassword(email, password);
  res.send({ result });
}

const handler = methods({
  post: postHandler,
  patch: patchHandler,
});

export default handler;
