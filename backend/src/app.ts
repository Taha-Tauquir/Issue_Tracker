import express, { Application, Request, Response } from "express";
import issueRouter from "./routes/issue.routes";
import cors from "cors";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.use("/api/issues", issueRouter);

export default app;
