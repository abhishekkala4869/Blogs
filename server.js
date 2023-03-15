const app = require("./app");
const { connectDB } = require("./configs/dbConfig");
require("dotenv").config();
async function start() {
  await connectDB(process.env.MONGO_URI);
  console.log("connected to db");
  app.listen(process.env.PORT, () => {
    console.log(`Server is up on http://localhost:${process.env.PORT}`);
  });
}
start();
