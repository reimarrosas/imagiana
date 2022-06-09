import { ErrorRequestHandler, RequestHandler } from "express";

import { HttpInternal, HttpNotFound } from "../utils/httpErrors";
import logger from "../utils/logger";

export const notFound: RequestHandler = (req, _res, next) => {
  next(new HttpNotFound(`${req.originalUrl} Not Found!`));
};

export const error: ErrorRequestHandler = (err, _req, res, _next) => {
  const logContents = { err };
  err = err.statusCode ? err : new HttpInternal();

  if (err.statusCode >= 500) {
    logger.error(logContents);
  } else if (err.statusCode > 400) {
    logger.warn(logContents);
  }

  res.status(err.statusCode).send({
    error: err.toString(),
    message: err.message,
  });
};
