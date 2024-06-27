import * as ONVIFPTZ from "../SERVICES/service.ptz";
import * as ONVIFInit from "../SERVICES/service.init";
import { RequestHandler } from "express";
import { ONVIFConfigs } from "../UTILITIES/camera.configs";

//PTZ CONTINUOUS MOVE
export const PTZControl: RequestHandler = async (req, res, next) => {
    const { addr, user, pass, profileToken, speed } = req.body;

    if (!addr || !user || !pass || !speed || !profileToken) {
        return res.status(400).send({ message: "Some Field Is Missing..." });
    }

    const configs: ONVIFConfigs = { addr, user, pass };
    const ONVIFService = new ONVIFInit.ONVIFInitService(configs);

    try {
        await ONVIFService.Init();
        const ptzService = new ONVIFPTZ.ONVIFPTZService(ONVIFService);

        await ptzService.PTZControl(profileToken, speed);

        setTimeout(async () => {
            try {
                await ptzService.PTZStop(profileToken);
                console.log('PTZ Control Stopped...');
            } catch (error) {
                console.error('Failed To Stop PTZ...', error);
            }
        }, 2000);

        res.status(200).json({ message: "PTZ Control Is In Process..." });
    } catch (error) {
        res.status(500).json({ message: 'Failed To Control PTZ...', error: error });
    }
};