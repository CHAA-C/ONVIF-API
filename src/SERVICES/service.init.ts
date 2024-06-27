import { ONVIFConfigs } from "../UTILITIES/camera.configs";

export class ONVIFInitService {
    private digestClient: any;
    private addr: string;
    private user: string;
    private pass: string;

    constructor(private configs: ONVIFConfigs) {
        this.addr = `http://${configs.addr}/onvif/device_service`;
        this.user = configs.user;
        this.pass = configs.pass;
    }

    async Init() {
        try {
            const { default: DigestFetch } = await import('digest-fetch');
            this.digestClient = new DigestFetch(this.user, this.pass);
            console.log('DigestFetch Client Initialized...');
        } catch (error) {
            console.error('Error Initializing DigestFetch:', error);
            throw error;
        }
    }

    GetDigestClient() {
        return this.digestClient;
    }

    GetDeviceAddress() {
        return this.configs.addr;
    }

    GetDevicePassword() {
        return this.configs.pass;
    }
    
    GetDeviceUsername() {
        return this.configs.user;
    }
}