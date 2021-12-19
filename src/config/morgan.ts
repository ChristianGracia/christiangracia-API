import morgan, { StreamOptions } from "morgan";

import Logger from "./winston";

const stream: StreamOptions = {
  write: (message) => Logger.http(message),
};

// Skip all the Morgan http log if the 
// application is not running in development mode.
// This method is not really needed here since 
// we already told to the logger that it should print
// only warning and error messages in production.
const skip = () => {
  const env = process.env.NODE_ENV || "development";
  return env !== "development";
};

const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  { stream, skip }
);

export default morganMiddleware;