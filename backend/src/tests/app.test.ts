import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("API", () => {
  it("should return API health status", async () => {
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      status: "server is healthy",
    });
  });

  it("should create a todo", async () => {
    const response = await request(app).post("/api/todos").send({
      title: "Learn CI/CD",
    });

    expect(response.status).toBe(201);

    expect(response.body.title).toBe("Learn CI/CD");
    expect(response.body.completed).toBe(false);
  });

  it("should return todos", async () => {
    const response = await request(app).get("/api/todos");

    expect(response.status).toBe(200);

    expect(Array.isArray(response.body)).toBe(true);
  });
});
