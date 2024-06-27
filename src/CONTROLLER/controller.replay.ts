import * as ONVIFReplay from "../SERVICES/service.replay";
import * as ONVIFInit from "../SERVICES/service.init";
import { RequestHandler } from "express";
import { ONVIFConfigs } from "../UTILITIES/camera.configs";

//GET REPLAY URI
export const GetReplayURI: RequestHandler = async (req, res, next) => {
    const { addr, user, pass, starttime, endtime } = req.body;

    if (!addr || !user || !pass || !starttime || !endtime) {
        return res.status(400).send({ message: "Some Field Is Missing..." });
    }

    const configs: ONVIFConfigs = { addr, user, pass };
    const ONVIFService = new ONVIFInit.ONVIFInitService(configs);

    try {
        await ONVIFService.Init();
        const replayService = new ONVIFReplay.ONVIFReplayService(ONVIFService);

        const replayURI = await replayService.GetAllReplayURIs(starttime, endtime);

        res.status(200).json(replayURI);
    } catch (error) {
        res.status(500).json({ message: 'Failed To Fetch Recording Replay...', error: error })
    }
}
