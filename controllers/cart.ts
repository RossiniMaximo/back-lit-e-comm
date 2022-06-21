import { User } from "models/user";
import { getMe } from "controllers/user";

export async function addToCart(id: string, token) {
  const me = await getMe(token);
  me.data.cart.push(id);
  await me.push();
  return true;
}

export async function deleteItemFromCart(id: string, token) {
  const me = await getMe(token);
  const result = me.data.cart.map((i: any, index) => {
    if (i == id) {
      return me.data.cart.splice(index, 1);
    }
  });

  await me.push();
  return true;
}

export async function getCart(userId) {
  const user = new User(userId);
  await user.pull();
  return user.data.cart;
}
