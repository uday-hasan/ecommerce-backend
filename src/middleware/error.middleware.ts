import { Request, Response, NextFunction } from "express";
import { JsonWebTokenError } from "jsonwebtoken";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Global Error:", err);
  if (err instanceof JsonWebTokenError) {
    if (err.name === "JsonWebTokenError") {
      res.status(402).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    } else if (err.name === "TokenExpiredError") {
      res.status(403).json({
        success: false,
        message: "Session end, login again.",
      });
      return;
    } else {
      res.status(403).json({
        success: false,
        message: "Forbidden",
      });
      return;
    }
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong",
  });
}
export default errorHandler;
