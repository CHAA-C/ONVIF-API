import * as ONVIFDiscover from "../SERVICES/service.discover";
import { RequestHandler } from "express";

//DISCOVER ONVIF DEVICE
export const DiscoverDevice: RequestHandler = async (req, res, next) => {
    const { START_IP_ADDRESS } = req.body;

    const discoverService = new ONVIFDiscover.ONVIFDiscoverService();

    try {
        const discoverDevices = await discoverService.DiscoverDevice(START_IP_ADDRESS);
        res.status(200).json({ Devices: discoverDevices });
    } catch (error) {
        res.status(500).json({ message: 'Failed To Discover Devices...', error: error });
    }
}