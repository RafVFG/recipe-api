import { response } from "../../src/adapters/controllers/interfaces/status-code";

describe("response helper", () => {
  it("unauthorized returns 401 with message", async () => {
    const res = response();
    const result = await res.unauthorized("Token inválido");
    expect(result.statusCode).toBe(401);
    expect(result.body).toBe("Token inválido");
  });

  it("notFound returns 404 with message", async () => {
    const res = response();
    const result = await res.notFound("Email não encontrado");
    expect(result.statusCode).toBe(404);
    expect(result.body).toBe("Email não encontrado");
  });
});
