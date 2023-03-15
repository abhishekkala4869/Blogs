const express = require("express");
const swagger = require("swagger-ui-express");
const helmet = require("helmet");
const logger = require("morgan");
const cors = require("cors");
const YAML = require("yamljs");
const swaggerJsDocs = YAML.load("./api.yaml");
const app = express();
//swagger for documentation
app.use("/api-docs", swagger.serve, swagger.setup(swaggerJsDocs));
//helmet for protection of headers from hackers
app.use(helmet());
//cors for cross origin errors
app.use(cors());
//morgan for logging routes action
app.use(logger("dev"));
app.use("api/v1/", router);

module.exports = app;
