const mongoose = require("mongoose");

exports.connectDB = (uri) => {
  mongoose.set({ strictQuery: false });
  console.log("Connected");
  return mongoose.connect(uri);
};
