import * as ONVIFRecord from "../CONTROLLER/controller.record";
import { Router } from "express";

const router = Router();

router.post("/getRecordingMode", ONVIFRecord.GetRecordings);
router.post("/getRecordingCapabilities", ONVIFRecord.GetServiceCapabilities);

export default router;