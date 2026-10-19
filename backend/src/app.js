import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env";
export function createApp() {
    const app = express();
    // Security headers (and removes the "X-Powered-By: Express" header).
    app.use(helmet());
    // The mobile app is not a browser, so it does not need CORS.
    // This only matters for web clients, such as a future admin dashboard.
    const allowedOrigins = env.CORS_ORIGINS.split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);
    app.use(cors({ origin: allowedOrigins.length > 0 ? allowedOrigins : false }));
    // Reject unusually large request bodies.
    app.use(express.json({ limit: "100kb" }));
    app.get("/api/v1/health", (_req, res) => {
        res.status(200).json({
            status: "ok",
            environment: env.NODE_ENV,
            timestamp: new Date().toISOString(),
        });
    });
    // Any route not defined above.
    app.use((_req, res) => {
        res.status(404).json({
            error: { code: "NOT_FOUND", message: "Route not found." },
        });
    });
    // Central error handler: the one place that decides what clients see.
    const errorHandler = (err, _req, res, _next) => {
        if (err instanceof SyntaxError) {
            res.status(400).json({
                error: { code: "INVALID_JSON", message: "Request body is not valid JSON." },
            });
            return;
        }
        // Log the real reason on the server, but never send it to the client.
        console.error("Unhandled error:", err instanceof Error ? err.message : err);
        res.status(500).json({
            error: { code: "INTERNAL_ERROR", message: "Something went wrong." },
        });
    };
    app.use(errorHandler);
    return app;
}
