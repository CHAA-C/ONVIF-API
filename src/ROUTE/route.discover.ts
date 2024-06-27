import * as ONVIFDiscover from "../CONTROLLER/controller.discover";
import { Router } from "express";

const router = Router();

router.post("/discoverDevice", ONVIFDiscover.DiscoverDevice);

export default router;