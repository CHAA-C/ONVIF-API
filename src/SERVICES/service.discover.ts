import { startProbe } from "node-onvif-ts";

export class ONVIFDiscoverService {
    async DiscoverDevice(IP_ADDRESS?: string) {
        try {
            const INFO = await startProbe(IP_ADDRESS);
            return INFO.map((device: any) => ({
                urn: device.urn,
                name: device.name,
                xaddrs: device.xaddrs[0],
            }));
        } catch (error) {
            console.error('Failed To Discover ONVIF Device...');
            throw error;
        }
    }
}