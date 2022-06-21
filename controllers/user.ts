import { User } from "models/user";

export async function getMe(userId) {
  const user = new User(userId);
  await user.pull();
  return user;
}
