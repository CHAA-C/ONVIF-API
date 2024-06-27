import { ONVIFInitService } from "./service.init";

export class ONVIFPTZService {
    private InitService: ONVIFInitService;

    constructor(InitService: ONVIFInitService) {
        this.InitService = InitService;
    }

    async PTZControl(profileToken: string, speed: any) {
        const soapBody = `
            <s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope">
                <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
                    <ContinuousMove xmlns="http://www.onvif.org/ver20/ptz/wsdl">
                        <ProfileToken>${profileToken}</ProfileToken>
                        <Velocity>
                            <PanTilt x="${speed.x}" y="${speed.y}" xmlns="http://www.onvif.org/ver10/schema"/>
                            <Zoom x="${speed.z}" xmlns="http://www.onvif.org/ver10/schema"/>
                        </Velocity>
                    </ContinuousMove>
                </s:Body>
            </s:Envelope>
        `;

        try {
            const response = await this.InitService.GetDigestClient().fetch(

                // ONVIF Hikvision Link
                `http://${this.InitService.GetDeviceAddress()}/onvif/PTZ`,

                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/soap+xml; charset=utf-8',
                    },
                    body: soapBody,
                }
            );
            if (!response.ok) {
                throw new Error(`HTTP Error Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Failed To Control PTZ Of Device...', error);
            throw error;
        }
    }

    async PTZStop(profileToken: string) {
        const soapBody = `
            <s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope">
                <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
                    <Stop xmlns="http://www.onvif.org/ver20/ptz/wsdl">
                        <ProfileToken>${profileToken}</ProfileToken>
                        <PanTilt>true</PanTilt>
                        <Zoom>true</Zoom>
                    </Stop>
                </s:Body>
            </s:Envelope>
        `;

        try {
            const response = await this.InitService.GetDigestClient().fetch(

                // ONVIF Hikvision Link
                `http://${this.InitService.GetDeviceAddress()}/onvif/PTZ`,

                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/soap+xml; charset=utf-8',
                    },
                    body: soapBody,
                }
            );
            if (!response.ok) {
                throw new Error(`HTTP Error Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Failed To Control PTZ Of Device...', error);
            throw error;
        }
    }
}