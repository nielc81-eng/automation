import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import departmentRoutes from "./routes/department.routes";
import complianceRoutes from "./routes/compliance.routes";
import reportRoutes from "./routes/report.routes";
import emaillogRoutes from "./routes/emaillog.routes";
import { errorHandler } from "./middleware/error.middleware";

// 💡 What is this file?
// This is the Express application setup. Think of it as configuring the building 
// before opening the doors. We set up security, body parsing, and later, our routes.

const app = express();

// 1. Middleware: cors()
// Allows our future frontend (or n8n) to talk to this API from a different domain.
app.use(cors());

// 2. Middleware: express.json()
// Allows our API to understand JSON data sent in the request body (like POST /login).
app.use(express.json());

// A simple health check route to test if the API is running
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Compliance API is running!" });
});

// 3. API Routes
// This maps URLs starting with "/api/auth" to our Auth routes.
app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/compliance", complianceRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/emaillogs", emaillogRoutes);

// 4. Global Error Handler
// Must be registered LAST, after all routes and other middleware.
app.use(errorHandler);

export default app;
