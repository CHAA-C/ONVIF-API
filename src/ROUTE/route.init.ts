import { Init } from "../CONTROLLER/controller.init";
import { Router } from "express";

const router = Router();

router.post("/init", Init);

export default router;