import { firestore } from "lib/conn/firestore";

const collection = firestore.collection("users");

type UserData = {
  email: string;
  fullname: string;
  id?: string;
  cart: string[];
};

export class User {
  id: string;
  ref: FirebaseFirestore.DocumentReference;
  data: UserData;
  constructor(id: string) {
    this.id = id;
    this.ref = collection.doc(id);
    this.data = {
      email: "",
      fullname: "",
      id: id,
      cart: ([] = []),
    };
  }
  async pull() {
    const userSnap = await this.ref.get();
    this.data = userSnap.data() as UserData;
  }
  async push() {
    await this.ref.update(this.data);
  }
  static async createUser(data: UserData) {
    const flatEmail = data.email.trim().toLowerCase();
    data.email = flatEmail;
    const userSnap = await collection.add(data);
    const user = new User(userSnap.id);
    user.data = data;
    user.data.id = userSnap.id;
    return data;
  }
}
