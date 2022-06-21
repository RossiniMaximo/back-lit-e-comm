import { Auth } from "models/auth";
import { User } from "models/user";
import randomInteger from "random-int";
import addMinutes from "date-fns/addMinutes";
import { sendAuthMail } from "lib/conn/sendgrid";
import { generateStorageToken } from "lib/jwt";
import crypto from "crypto";

function getSHA256ofString(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function findOrCreate(email: string, fullname: string, password: string) {
  const findAuth = await Auth.findByEmailAndPassword(email, password);
  if (findAuth) {
    return findAuth;
  } else {
    const user = await User.createUser({ email, fullname, cart: [] });
    const auth = await Auth.createAuth({
      email,
      code: null,
      expiration: null,
      ia: new Date(),
      userId: user.id,
      password: getSHA256ofString(password),
    });
    return auth;
  }
}

export async function sendCode(email, fullname, password) {
  const auth = await findOrCreate(email, fullname, password);
  let code = randomInteger(10000, 99999);
  const expiration = addMinutes(new Date(), 20);
  auth.data.code = code;
  auth.data.expiration = expiration;
  await auth.push();
  await sendAuthMail(email, code, expiration);
  return true;
}

export async function createToken(email: string, code: number) {
  const auth = await Auth.findByEmailAndCode(email, code);
  console.log(auth);

  await auth.pull();
  const expirated = auth.checkExpiration();
  if (!expirated) {
    (auth.data.code = null), (auth.data.expiration = null);
    await auth.push();
    const token = generateStorageToken(auth.data.userId);
    return token;
  } else {
    return "Code expirated";
  }
}

export async function updatePassword(email: string, password: string) {
  const res = await Auth.updatePassword(email, password);
  return res;
}
