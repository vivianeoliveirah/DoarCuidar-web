import { Router } from "express";
import { criarDoacao, listarDoacoes } from "../services/doacoesService.js";
import { getUserId } from "../middleware/auth.js";

export const doacoesRouter = Router();

doacoesRouter.get("/", async (req, res, next) => {
  try {
    const data = await listarDoacoes(getUserId(req));
    res.json(data);
  } catch (error) {
    next(error);
  }
});

doacoesRouter.post("/", async (req, res, next) => {
  try {
    const data = await criarDoacao(req.body, getUserId(req));
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
});
