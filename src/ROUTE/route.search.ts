import * as ONVIFSearch from "../CONTROLLER/controller.search";
import { Router } from "express";

const router = Router();

router.post("/getRecordingInformation", ONVIFSearch.GetRecordingInformation);

export default router;