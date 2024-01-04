import express, { Request, Response } from "express";
const router = express.Router();

router.get("/", function (req: Request, res: Response) {
  res.send("Hello World!");
});

export default router;
