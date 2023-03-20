const mongoose = require("mongoose");

exports.connectDB = (uri) => {
  mongoose.set({ strictQuery: false });
  return mongoose.connect(uri);
};
