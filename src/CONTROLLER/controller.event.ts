import * as ONVIFEvent from "../SERVICES/service.event";
import * as ONVIFInit from "../SERVICES/service.init";
import { RequestHandler } from "express";
import { ONVIFConfigs } from "../UTILITIES/camera.configs";

//GET EVENT PROPERTIES
export const GetEventProperties: RequestHandler = async (req, res, next) => {
    const { addr, user, pass } = req.body;

    if (!addr || !user || !pass) {
        return res.status(400).send({ message: "Some Field Is Missing..." });
    }

    const configs: ONVIFConfigs = { addr, user, pass };
    const ONVIFService = new ONVIFInit.ONVIFInitService(configs);

    try {
        await ONVIFService.Init();
        const eventService = new ONVIFEvent.ONVIFEventService(ONVIFService);

        const getEventProperties = await eventService.GetEventProperties();

        res.status(200).json({ getEventProperties });
    } catch (error) {
        res.status(500).json({ message: "Failed To Fetch Event Properties...", error: error })
    }
}