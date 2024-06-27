import * as ONVIFEvent from "../CONTROLLER/controller.event";
import { Router } from "express";

const router = Router();

router.post("/eventProperties", ONVIFEvent.GetEventProperties);

export default router;