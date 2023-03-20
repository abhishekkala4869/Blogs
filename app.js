const express = require("express");
const swagger = require("swagger-ui-express");
const helmet = require("helmet");
const logger = require("morgan");
const cors = require("cors");
const YAML = require("yamljs");
const errorMiddleware = require("./middleware/error");
const swaggerJsDocs = YAML.load("./api.yaml");
const app = express();
//routes
const userRoute = require("./routes/userRoute");
const blogRoute = require("./routes/blogRoute");
app.use(express.json());
//swagger for documentation
app.use("/api-docs", swagger.serve, swagger.setup(swaggerJsDocs));
//helmet for protection of headers from hackers
app.use(helmet());
//cors for cross origin errors
app.use(cors());
//morgan for logging routes action
app.use(logger("dev"));
//routes
app.use("/api/v1", userRoute);
app.use("/api/v1", blogRoute);

//midddleware for error
app.use(errorMiddleware);
module.exports = app;
