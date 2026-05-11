import { Router } from "express";
import { login, registrar, solicitarResetSenha } from "../services/authService.js";

export const authRouter = Router();

authRouter.post("/login", async (req, res, next) => {
  try {
    const data = await login(req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

authRouter.post("/register", async (req, res, next) => {
  try {
    const data = await registrar(req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
});

authRouter.post("/password-reset", async (req, res, next) => {
  try {
    const data = await solicitarResetSenha(req.body.email);
    res.json(data);
  } catch (error) {
    next(error);
  }
});
