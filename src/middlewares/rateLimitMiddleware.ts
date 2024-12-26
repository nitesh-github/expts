const rateLimit = require("express-rate-limit");
export const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // Limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again later.",
});