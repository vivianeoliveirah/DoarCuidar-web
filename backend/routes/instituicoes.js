import { Router } from "express";
import {
  atualizarStatusInstituicao,
  buscarInstituicaoPorId,
  criarInstituicao,
  deletarInstituicao,
  listarInstituicoes,
} from "../services/instituicoesService.js";
import { HttpError } from "../lib/httpError.js";

export const instituicoesRouter = Router();

instituicoesRouter.get("/", async (req, res, next) => {
  try {
    const data = await listarInstituicoes(req.query);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

instituicoesRouter.get("/:id", async (req, res, next) => {
  try {
    const data = await buscarInstituicaoPorId(req.params.id);
    if (!data) throw new HttpError("Instituicao nao encontrada.", 404);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

instituicoesRouter.post("/", async (req, res, next) => {
  try {
    const data = await criarInstituicao(req.body);
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
});

instituicoesRouter.patch("/:id/status", async (req, res, next) => {
  try {
    const data = await atualizarStatusInstituicao(req.params.id, req.body.status);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

instituicoesRouter.delete("/:id", async (req, res, next) => {
  try {
    await deletarInstituicao(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});
