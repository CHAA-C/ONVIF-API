import * as ONVIFMedia from "../SERVICES/service.media";
import * as ONVIFInit from "../SERVICES/service.init";
import { RequestHandler } from "express";
import { ONVIFConfigs } from "../UTILITIES/camera.configs";

// FETCH PROFILE TOKENS
export const GetProfilesToken: RequestHandler = async (req, res, next) => {
    const { addr, user, pass } = req.body;

    if (!addr || !user || !pass) {
        return res.status(400).send({ message: "Some Field Is Missing..." });
    }

    const configs: ONVIFConfigs = { addr, user, pass };
    const ONVIFService = new ONVIFInit.ONVIFInitService(configs);

    try {
        await ONVIFService.Init();
        const mediaService = new ONVIFMedia.ONVIFMediaService(ONVIFService);
        const profilesToken = await mediaService.GetProfileTokens();
        res.status(200).json({ Profiles: profilesToken });
    } catch (error) {
        res.status(500).json({ message: 'Failed To Fetch Profiles...', error: error });
    }
};

//FETCH STREAM URIs
export const GetStreamURIs: RequestHandler = async (req, res, next) => {
    const { addr, user, pass } = req.body;

    if (!addr || !user || !pass) {
        return res.status(400).send({ message: "Some Field Is Missing..." });
    }

    const configs: ONVIFConfigs = { addr, user, pass };
    const ONVIFService = new ONVIFInit.ONVIFInitService(configs);

    try {
        await ONVIFService.Init();
        const mediaService = new ONVIFMedia.ONVIFMediaService(ONVIFService);
        const streamURI = await mediaService.GetAllStreamURIs();
        res.status(200).json({ StreamURIs: streamURI });
    } catch (error) {
        res.status(500).json({ message: 'Failed To Fetch Stream URIs...', error: error });
    }
};

//FETCH SNAPSHOTS URIs
export const GetSnapshotURIs: RequestHandler = async (req, res, next) => {
    const { addr, user, pass } = req.body;

    if (!addr || !user || !pass) {
        return res.status(400).send({ message: "Some Field Is Missing..." });
    }

    const configs: ONVIFConfigs = { addr, user, pass };
    const ONVIFService = new ONVIFInit.ONVIFInitService(configs);

    try {
        await ONVIFService.Init();
        const mediaService = new ONVIFMedia.ONVIFMediaService(ONVIFService);
        const streamURI = await mediaService.GetAllSnapshotURIs();
        res.status(200).json({ StreamURIs: streamURI });
    } catch (error) {
        res.status(500).json({ message: 'Failed To Fetch Stream URIs...', error: error });
    }
};

//DOWNLOAD SNAPSHOT
export const DownloadSnapshot: RequestHandler = async (req, res, next) => {
    const { addr, user, pass, profileName } = req.body;

    if (!addr || !user || !pass || !profileName) {
        return res.status(400).send({ message: "Some Field Is Missing..." });
    }

    const configs: ONVIFConfigs = { addr, user, pass };
    const ONVIFService = new ONVIFInit.ONVIFInitService(configs);

    try {
        await ONVIFService.Init();
        const mediaService = new ONVIFMedia.ONVIFMediaService(ONVIFService);
        const downloadSnapshot = await mediaService.DownloadSnapshot(profileName);
        res.status(200).json({ message: "Download Snapshot Successfully..." });
    } catch (error) {
        res.status(500).json({ message: 'Failed To Download Snapshot...', error: error });
    }
};
