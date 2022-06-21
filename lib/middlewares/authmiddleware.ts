import type { NextApiRequest, NextApiResponse } from "next";
import { decode } from "jsonwebtoken";

export function authMiddleware(callback) {
  return function (req: NextApiRequest, res: NextApiResponse) {
    const token = req.headers.authorization.split(" ")[1];
    const valid = decode(token);
    if (valid) {
      callback(req, res, valid);
    }
  };
}
