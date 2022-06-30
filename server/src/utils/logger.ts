import bunyan from "bunyan";

const loggerOptions: bunyan.LoggerOptions = {
  name: "Imagiana",
  streams: [
    {
      level: "warn",
      stream: process.stderr,
    },
  ],
  serializers: bunyan.stdSerializers,
};

const logger = bunyan.createLogger(loggerOptions);

export default logger;
