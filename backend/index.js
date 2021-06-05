const config = require("./config/config");
const mongoose = require("mongoose");
const app = require("./app");
const logger = require("./config/logger");
 
 
app.listen(config.port, () =>
  console.log(`App listening on port 8082!`),
);

mongoose.connect(config.mongoose.url, { useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
  console.log("Connected to MongoDB")
});


const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

