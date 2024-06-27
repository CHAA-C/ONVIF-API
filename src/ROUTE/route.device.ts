import * as ONVIFDevice from "../CONTROLLER/controller.device";
import { Router } from "express";

const router = Router();

router.post("/getUsers", ONVIFDevice.GetUsers);

export default router;