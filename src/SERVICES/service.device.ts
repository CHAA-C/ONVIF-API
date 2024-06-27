import { ONVIFInitService } from "./service.init";
import { parseStringPromise } from "xml2js";

export class ONVIFDeviceService {
    private InitService: ONVIFInitService;

    constructor(InitService: ONVIFInitService) {
        this.InitService = InitService;
    }

    async GetUsers() {
        const soapBody = `
            <s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope">
                <s:Body>
                    <GetUsers xmlns="http://www.onvif.org/ver10/device/wsdl"/>
                </s:Body>
            </s:Envelope>
        `;

        const fetchUri = async (URI: string) => {
            try {
                const response = await this.InitService.GetDigestClient().fetch(URI, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/soap+xml; charset=utf-8',
                    },
                    body: soapBody,
                });

                if (!response.ok) {
                    throw new Error(`HTTP Error Status: ${response.status} - ${response.statusText}`);
                }

                const responseText = await response.text();
                const parseResponse = await parseStringPromise(responseText);

                try {
                    const usersInformation = parseResponse['s:Envelope']['s:Body'][0]['tds:GetUsersResponse'][0]['tds:User'];
                    return usersInformation.map((user: any) => ({
                        username: user['tt:Username'][0],
                        level: user['tt:UserLevel'][0],
                    }));
                } catch (error) {
                    try {
                        const usersInformation = parseResponse['env:Envelope']['env:Body'][0]['tds:GetUsersResponse'][0]['tds:User'];
                        return usersInformation.map((user: any) => ({
                            username: user['tt:Username'][0],
                            level: user['tt:UserLevel'][0],
                        }));
                    } catch (error) {
                        try {
                            const usersInformation = parseResponse['soap:Envelope']['soap:Body'][0]['tds:GetUsersResponse'][0]['tds:User'];
                            return usersInformation.map((user: any) => ({
                                username: user['tt:Username'][0],
                                level: user['tt:UserLevel'][0],
                            }));
                        } catch (error) {
                            throw new Error('Failed To Parse The Response Using Both Dahua And Hikvision Formats.');
                        }
                    }
                }
            } catch (error) {
                console.error(`Failed To Fetch From ${URI}`, error);
                throw error;
            }
        };

        const dahuaURI = `http://${this.InitService.GetDeviceAddress()}/onvif/device_service`;
        const hikvisionURI = `http://${this.InitService.GetDeviceAddress()}/onvif/device_service`;

        try {
            return await fetchUri(dahuaURI);
        } catch (error) {
            console.log("Fetch Hikvision URI...");
            return await fetchUri(hikvisionURI);
        }
    }
}
