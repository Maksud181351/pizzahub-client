/**
 * Creates (or promotes) the admin account. Admin can't be created through the public sign-up form.
 * Usage: set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local, then run:  npm run seed:admin
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
if (!email || !password) {
  console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD first.");
  process.exit(1);
}

const { auth, db } = await import("../lib/auth.js");
const users = db.collection("users");

let user = await users.findOne({ email });
if (!user) {
  await auth.api.signUpEmail({ body: { name: "PizzaHub Admin", email, password } });
  user = await users.findOne({ email });
}
await users.updateOne({ _id: user._id }, { $set: { role: "admin", onboarded: true, isBlocked: false, updatedAt: new Date() } });
console.log(`Admin ready: ${email}`);
process.exit(0);
