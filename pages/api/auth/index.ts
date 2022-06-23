import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { sendCode } from "controllers/auth";
import { updatePassword } from "controllers/auth";
import NextCors from "nextjs-cors";

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  await NextCors(req, res, {
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "https://maxis-e-comm.herokuapp.com",
    optionsSuccessStatus: 200,
  });
  if (!req.body) {
    res.status(400).send({ Error: "body missing" });
  }
  const { email, fullname, password } = req.body;
  const result = await sendCode(email, fullname, password);
  res.send({ result });
}

async function patchHandler(req: NextApiRequest, res: NextApiResponse) {
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
