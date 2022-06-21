import jwt from "jsonwebtoken";

export function generateStorageToken(data) {
  return jwt.sign(data, process.env.JWT_KEY);
}

export function decode(token) {
  try {
    const validate = jwt.verify(token, process.env.JWT_KEY);
    return validate;
  } catch (error) {
    return { error };
  }
}
