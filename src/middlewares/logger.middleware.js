const { createLogger, format, transports } = require("winston");
require("winston-daily-rotate-file");

// Define daily rotating file transport
const dailyRotateTransport = new transports.DailyRotateFile({
  filename: "logs/%DATE%-app.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "14d",
  zippedArchive: true,
});

const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: "multi-tenant-billing" },
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
    dailyRotateTransport,
  ],
});

module.exports = logger;
