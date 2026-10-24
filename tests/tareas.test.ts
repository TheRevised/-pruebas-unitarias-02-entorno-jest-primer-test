// Importamos supertest, que es una herramienta que nos ayuda a probar APIs
// Es como un navegador virtual que puede hacer peticiones a nuestra aplicación
import request from "supertest";

// Importamos nuestra aplicación para poder probarla
// Es como traer toda nuestra aplicación para ver si funciona correctamente
import app from "../src/app";
import { limpiarTareas } from "../src/services/tareas.service";

describe("Pruebas de la API de tareas", () => {
  beforeEach(() => {
    limpiarTareas();
  });

  describe("GET /tareas", () => {
    it("Debe obtener la lista de tareas", async () => {
      const response = await request(app).get("/tareas");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("POST /tareas", () => {
    it("Debe crear una tarea cuando se envía título y descripción", async () => {
      const nuevaTarea = {
        titulo: "Aprender mocks",
        descripcion: "Estudiar mocks y stubs en Jest"
      };

      const response = await request(app).post("/tareas").send(nuevaTarea);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.titulo).toBe(nuevaTarea.titulo);
      expect(response.body.descripcion).toBe(nuevaTarea.descripcion);
      expect(response.body.completada).toBe(false);
    });

    it("Debe responder con 400 si falta algún campo obligatorio", async () => {
      const tareaInvalida = {
        titulo: "Tarea sin descripción"
      };

      const response = await request(app).post("/tareas").send(tareaInvalida);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("mensaje");
      expect(response.body.mensaje).toMatch(/obligatorios/i);
    });
  });
});
