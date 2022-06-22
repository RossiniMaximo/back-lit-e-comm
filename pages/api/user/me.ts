import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares/authmiddleware";
import methods from "micro-method-router";
import { getMe } from "controllers/user";
import { cors, runMiddleware } from "lib/middlewares/cors";

async function getHandler(req: NextApiRequest, res: NextApiResponse, token) {
  await runMiddleware(req, res, cors);
  const user = await getMe(token);
  res.send(user.data);
}

const handler = methods({
  get: getHandler,
});

export default authMiddleware(handler);
