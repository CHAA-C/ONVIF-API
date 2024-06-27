import * as ONVIFSearch from "../SERVICES/service.search";
import * as ONVIFInit from "../SERVICES/service.init";
import { RequestHandler } from "express";
import { ONVIFConfigs } from "../UTILITIES/camera.configs";

//GET RECORDING INFORMATION
export const GetRecordingInformation: RequestHandler = async (req, res, next) => {
    const { addr, user, pass } = req.body;

    if (!addr || !user || !pass) {
        return res.status(400).send({ message: "Some Field Is Missing..." });
    }

    const configs: ONVIFConfigs = { addr, user, pass };
    const ONVIFService = new ONVIFInit.ONVIFInitService(configs);

    try {
        await ONVIFService.Init();
        const searchService = new ONVIFSearch.ONVIFSearchService(ONVIFService);

        const recordingStatus = await searchService.GetRecordingStatus();

        res.status(200).json(recordingStatus);
    } catch (error) {
        res.status(500).json({ message: 'Failed To Fetch Recording Information...', error: error });
    }
};