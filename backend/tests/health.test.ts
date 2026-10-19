import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app";

describe("GET /api/v1/health", () => {
  it("returns status ok", async () => {
    const response = await request(createApp()).get("/api/v1/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });

  it("does not advertise the Express framework", async () => {
    const response = await request(createApp()).get("/api/v1/health");

    expect(response.headers["x-powered-by"]).toBeUndefined();
  });
});

describe("error handling", () => {
  it("returns a structured 404 for unknown routes", async () => {
    const response = await request(createApp()).get("/api/v1/nothing");

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("NOT_FOUND");
  });

  it("returns a structured 400 for malformed JSON", async () => {
    const response = await request(createApp())
      .post("/api/v1/health")
      .set("Content-Type", "application/json")
      .send("{ this is not json");

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("INVALID_JSON");
  });
});
