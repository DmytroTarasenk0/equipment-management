const request = require("supertest");

// test /status route
describe("API Testing", () => {
  test("GET /status should respond with 200 and server data", async () => {
    const response = await request("http://localhost:3000").get("/status");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("uptime");
    expect(response.body).toHaveProperty("memoryUsage");
  });
});
