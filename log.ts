import winston from "winston";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// Create logs directory if it doesn't exist
const logsDirectory = path.join(__dirname, "logs");
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory);
}

// Encryption key (replace this with your own secret key)
const encryptionKey = "YourSecretEncryptionKey";

// Define a custom format for the logs
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

// Create a transport for logging to a file
const fileTransport = new winston.transports.File({
  filename: path.join(logsDirectory, "app.log"),
  format: logFormat,
  level: "info", // Set the desired log level
});

// Create a logger instance
const logger = winston.createLogger({
  //   transports: [fileTransport],
  transports: [
    new winston.transports.File({
      filename: "./logs/error.log",
      format: logFormat,
      level: "error",
    }),
    new winston.transports.File({
      filename: "./logs/all.log",
      format: logFormat,
      level: "info",
    }),
    new winston.transports.File({
        filename: "./logs/moneyTransfer.log",
        format: logFormat,
        level: "money",
    }),
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
});

// Secure logging function with encryption
function secureLog(level: string, message: string, meta?: Record<string, any>) {
  // Add any additional security checks or redaction logic here
  // Encrypt the log message
  const cipher = crypto.createCipher("aes-256-cbc", encryptionKey);
  let encryptedMessage = cipher.update(message, "utf-8", "hex");
  encryptedMessage += cipher.final("hex");

  // Log the encrypted message
  logger.log({
    level,
    message: encryptedMessage,
    meta,
  });
}

// // Define a custom format for the logs
// const logFormat = winston.format.combine(
//     winston.format.timestamp(),
//     winston.format.json()
//   );

// const baseLogger = winston.createLogger({
//   format: logFormat,
//   defaultMeta: { project: "Smart Parking System" },
//   transports: [
//     new winston.transports.File({
//       filename: "./logs/error.log",
//       level: "error",
//     }),
//     new winston.transports.File({ filename: "./logs/all.log", level: "info" }),
//     new winston.transports.Console({ format: winston.format.simple() }),
//     new winston.transports.File({
//       filename: "./logs/moneyTransfer.log",
//       level: "Money",
//     }),
//   ],
// });
