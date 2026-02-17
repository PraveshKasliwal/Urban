require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./Models/user");

mongoose.connect(process.env.MONGO_URI);
email = ""; // 👈 change this to the email of the user you want to make admin

async function makeAdmin() {
  await User.updateOne(
    { email: email },
    { $set: { role: "admin" } }
  );

  console.log("✅ User promoted to admin");
  process.exit();
}

makeAdmin();