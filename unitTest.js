const request = require("supertest");
const app = require("../app"); // your Express app
// const db = require("../db"); // your DB utility (mock this in unit tests)

const dbMain = require("./my-app/supabaseClient")
const dbClient = require("./my-app/SupabaseParticipantClient")

jest.mock("../db"); // mock the DB module

describe("POST /api/submit", () => {
  it("should evaluate SQL and return success if correct", async () => {
    // Mock correct output from your evaluator logic
    db.evaluateSQL.mockResolvedValue({
      isCorrect: true,
      message: "Correct Answer",
      expected: [{ id: 1, name: "Alice" }],
      received: [{ id: 1, name: "Alice" }],
    });

    const response = await request(app).post("/api/submit").send({
      userId: "123",
      contestId: "456",
      questionId: "789",
      sql: "SELECT * FROM Users;",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: "Correct Answer",
    });
  });

  it("should return error if SQL is incorrect", async () => {
    db.evaluateSQL.mockResolvedValue({
      isCorrect: false,
      message: "Incorrect output",
      expected: [{ id: 1 }],
      received: [],
    });

    const response = await request(app).post("/api/submit").send({
      userId: "123",
      contestId: "456",
      questionId: "789",
      sql: "SELECT * FROM NonExistentTable;",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      success: false,
      message: "Incorrect output",
    });
  });

  it("should handle SQL syntax errors gracefully", async () => {
    db.evaluateSQL.mockRejectedValue(new Error("Syntax error in SQL"));

    const response = await request(app).post("/api/submit").send({
      userId: "123",
      contestId: "456",
      questionId: "789",
      sql: "BAD SQL",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      success: false,
      message: "Syntax error in SQL",
    });
  });
});
