import bunyan from "bunyan";
import path from "path";

const loggerOptions: bunyan.LoggerOptions = {
  name: "Imagiana",
  streams: [
    {
      level: "warn",
      path: path.join(__dirname, "..", "..", "logs", "imgn-error.log"),
    },
  ],
  serializers: bunyan.stdSerializers,
};

const logger = bunyan.createLogger(loggerOptions);

export default logger;
