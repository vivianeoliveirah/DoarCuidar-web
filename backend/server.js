import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { authRouter } from "./routes/auth.js";
import { doacoesRouter } from "./routes/doacoes.js";
import { instituicoesRouter } from "./routes/instituicoes.js";
import { listarDoacoes } from "./services/doacoesService.js";
import { HttpError } from "./lib/httpError.js";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "doarcuidar-backend" });
});

app.use("/instituicoes", instituicoesRouter);
app.use("/doacoes", doacoesRouter);
app.use("/auth", authRouter);
app.use("/api/instituicoes", instituicoesRouter);
app.use("/api/doacoes", doacoesRouter);
app.use("/api/auth", authRouter);

app.get("/perfil", async (req, res, next) => {
  try {
    const user = req.headers["user-id"] ? { id: req.headers["user-id"] } : null;
    const doacoes = await listarDoacoes(user?.id || "");
    res.json({ user, doacoes });
  } catch (error) {
    next(error);
  }
});

app.get("/api/perfil", async (req, res, next) => {
  try {
    const user = req.headers["user-id"] ? { id: req.headers["user-id"] } : null;
    const doacoes = await listarDoacoes(user?.id || "");
    res.json({ user, doacoes });
  } catch (error) {
    next(error);
  }
});

app.use((_req, _res, next) => {
  next(new HttpError("Rota nao encontrada.", 404));
});

app.use((error, _req, res, next) => {
  void next;
  const statusCode = error.statusCode || 500;

  if (statusCode >= 500) {
    console.error("[DoarCuidar Backend]", error);
  }

  res.status(statusCode).json({
    error: error.message || "Erro interno do servidor.",
    details: error.details || undefined,
  });
});

app.listen(env.port, () => {
  console.log(`DoarCuidar backend listening on http://localhost:${env.port}`);
});
