import { firestore } from "lib/conn/firestore";
import isAfter from "date-fns/isAfter";
import crypto from "crypto";

function getSHA256ofString(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

const collection = firestore.collection("auths");

type AuthType = {
  email: string;
  code: number;
  expiration: any;
  ia: any;
  userId: string;
  password: string;
};

export class Auth {
  id: string;
  data: AuthType;
  ref: FirebaseFirestore.DocumentReference;
  constructor(id: string) {
    this.id = id;
    this.ref = collection.doc(id);
  }
  async pull() {
    const snapAuth = await this.ref.get();
    this.data = snapAuth.data() as AuthType;
  }
  async push() {
    await this.ref.update(this.data);
  }
  checkExpiration() {
    return isAfter(this.data.expiration, new Date());
  }
  static async updatePassword(email: string, password: string) {
    const hashedPass = getSHA256ofString(password);
    const flatEmail = email.trim().toLowerCase();
    const res = await collection.where("email", "==", flatEmail).get();
    if (res.docs.length) {
      const id = res.docs[0].id;
      const auth = new Auth(id);
      await auth.pull();
      auth.data.password = hashedPass;
      await auth.push();
      return auth;
    }
  }
  static async findByEmailAndPassword(email: string, password: string) {
    const hashedPass = getSHA256ofString(password);
    const flatEmail = email.trim().toLowerCase();
    const res = await collection
      .where("email", "==", flatEmail)
      .where("password", "==", hashedPass)
      .get();
    if (res.docs.length) {
      const id = res.docs[0].id;
      const auth = new Auth(id);
      auth.data = res.docs[0].data() as AuthType;
      return auth;
    }
  }

  static async createAuth(data: AuthType) {
    const flatEmail = data.email.trim().toLowerCase();
    data.email = flatEmail;
    const authSnap = await collection.add(data);
    const auth = new Auth(authSnap.id);
    auth.data = data;
    return auth;
  }

  static async findByEmailAndCode(email: string, code: number) {
    console.log("code", code);
    console.log("email", email);

    const flatEmail = email.trim().toLowerCase();
    const res = await collection
      .where("email", "==", flatEmail)
      .where("code", "==", code)
      .get();
    console.log("res docs:", res.docs);

    if (res.docs.length) {
      const doc = res.docs[0];
      const auth = new Auth(doc.id);
      auth.data = doc.data() as AuthType;
      return auth;
    }
  }
}
