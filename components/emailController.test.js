const request = require("supertest");
const app = require("../app"); // Importe a instância do aplicativo da sua API

describe("Email Controller", () => {
  it("deve inserir dados e retornar status 200", async () => {
    const response = await request(app)
      .post("/api/v1/email")
      .send({
        nome: "Nome do Cliente",
        email: "cliente@example.com",
        telefone: "1234567890",
        content: ["Serviço 1", "Serviço 2"],
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Dados inseridos com sucesso");
  });

  it("deve lidar com erros de validação", async () => {
    const response = await request(app).post("/api/v1/email").send({
      // Dados inválidos ou ausentes aqui
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toBeTruthy(); // Certifique-se de verificar a estrutura de erro específica retornada por sua API
  });

  //   it("deve lidar com erros internos do servidor", async () => {
  //     // Simule um erro no banco de dados
  //     jest.spyOn(require("../db"), "beginTransaction").mockImplementation(() => {
  //       throw new Error("Erro simulado no banco de dados");
  //     });

  //     const response = await request(app)
  //       .post("/api/v1/email")
  //       .send({
  //         nome: "Nome do Cliente",
  //         email: "cliente@example.com",
  //         telefone: "1234567890",
  //         content: ["Serviço 1", "Serviço 2"],
  //       });

  //     expect(response.status).toBe(500);
  //     expect(response.body.error).toBe("Erro interno do servidor");

  //     // Restaure a implementação original da função do banco de dados após o teste
  //     jest.restoreAllMocks();
  //   });
});
