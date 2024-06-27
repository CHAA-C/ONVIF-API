import * as ONVIFReplay from "../CONTROLLER/controller.replay";
import { Router } from "express";

const router = Router();

router.post("/getReplayURI", ONVIFReplay.GetReplayURI);

export default router;