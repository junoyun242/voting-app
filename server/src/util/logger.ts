import winston, { createLogger, format } from "winston";
import { join } from "path";
import dayjs from "dayjs";
const filePath = join(process.cwd(), "log");
const { align, printf } = format;

export const loggerObj = {
  level: "info",
  format: winston.format.combine(
    winston.format.simple(),
    align(),
    printf(
      (info) =>
        `[${dayjs().format("YYYY-MM-DD HH:mm:ss")}] ${
          info.level
        }: ${info.message.trim()} ${JSON.stringify(info)}`
    )
  ),
  transports: [
    new winston.transports.File({
      filename: join(filePath, "error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: join(filePath, "combined.log"),
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
};

export const logger = createLogger(loggerObj);
