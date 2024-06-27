import * as ONVIFDevice from "../SERVICES/service.device";
import * as ONVIFInit from "../SERVICES/service.init";
import { RequestHandler } from "express";
import { ONVIFConfigs } from "../UTILITIES/camera.configs";

//GET USER INFORMATION
export const GetUsers: RequestHandler = async (req, res, next) => {
    const { addr, user, pass } = req.body;

    if (!addr || !user || !pass) {
        return res.status(400).send({ message: "Some Field Is Missing..." });
    }

    const configs: ONVIFConfigs = { addr, user, pass };
    const ONVIFService = new ONVIFInit.ONVIFInitService(configs);

    try {
        await ONVIFService.Init();
        const deviceService = new ONVIFDevice.ONVIFDeviceService(ONVIFService);

        const getUsers = await deviceService.GetUsers();

        res.status(200).json({ getUsers });
    } catch (error) {
        res.status(500).json({ message: "Failed To Fetch Users Informations...", error: error });
    }
};