import * as ONVIFMedia from "../CONTROLLER/controller.media";
import { Router } from "express";

const router = Router();

router.post("/getProfileTokens", ONVIFMedia.GetProfilesToken);
router.post("/getStreamURIs", ONVIFMedia.GetStreamURIs);
router.post("/getSnapshotURIs", ONVIFMedia.GetSnapshotURIs);
router.post("/downloadSnapshot", ONVIFMedia.DownloadSnapshot);

export default router;