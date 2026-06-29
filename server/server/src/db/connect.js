const mongoose = require("mongoose");
require("dotenv").config();

const db = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/exp";

// Connect to MongoDB using the connection string
mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log(`Connection successful`);
}).catch((e) => {
  console.log(`No connection: ${e}`);
});
