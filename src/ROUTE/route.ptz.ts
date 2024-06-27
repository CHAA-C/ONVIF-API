import * as ONVIFPTZ from "../CONTROLLER/controller.ptz";
import { Router } from "express";

const router = Router();

router.post("/ptzControl", ONVIFPTZ.PTZControl);

export default router;