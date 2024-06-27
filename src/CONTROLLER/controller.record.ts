import * as ONVIFRecord from "../SERVICES/service.record";
import * as ONVIFInit from "../SERVICES/service.init";
import { RequestHandler } from "express";
import { ONVIFConfigs } from "../UTILITIES/camera.configs";

//GET RECORDING
export const GetRecordings: RequestHandler = async (req, res, next) => {
    const { addr, user, pass } = req.body;

    if (!addr || !user || !pass) {
        return res.status(400).send({ message: "Some Field Is Missing..." });
    }

    const configs: ONVIFConfigs = { addr, user, pass };
    const ONVIFService = new ONVIFInit.ONVIFInitService(configs);

    try {
        await ONVIFService.Init();
        const recordService = new ONVIFRecord.ONVIFRecordService(ONVIFService);
        const recordings = await recordService.GetRecordingMode();
        res.status(200).json({ Recording: recordings });
    } catch (error) {
        res.status(500).json({ message: 'Failed To Fetch Recording...' });
    }
};

//GET RECORDING SERVICE CAPABILITIES
export const GetServiceCapabilities: RequestHandler = async (req, res, next) => {
    const { addr, user, pass } = req.body;

    if (!addr || !user || !pass) {
        return res.status(400).send({ message: "Some Field Is Missing..." });
    }

    const configs: ONVIFConfigs = { addr, user, pass };
    const ONVIFService = new ONVIFInit.ONVIFInitService(configs);

    try {
        await ONVIFService.Init();
        const recordService = new ONVIFRecord.ONVIFRecordService(ONVIFService);
        const recordings = await recordService.GetServiceCapabilities();
        res.status(200).json({ Recording: recordings });
    } catch (error) {
        res.status(500).json({ message: 'Failed To Fetch Recording Capabilities...' });
    }
};
