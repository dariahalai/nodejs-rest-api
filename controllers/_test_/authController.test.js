const app = require("../../app");
const request = require("supertest");

describe("POST /users/login", () => {
  it("should return user and token", async () => {
    const testData = {
      email: "dasha@gmail.com",
      password: "dasha123456",
    };

    const response = await request(app).post("/api/users/login").send(testData);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
        user: {
          email: expect.any(String),
          subscription: expect.any(String),
        },
      })
    );
  });

  it("should return unathorized error", async () => {
    const testData = {
      email: "dashA@gmail.com",
      password: "dasha123456",
    };

    const response = await request(app).post("/api/users/login").send(testData);

    expect(response.statusCode).toBe(401);
  });
});
