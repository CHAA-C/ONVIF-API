import { ONVIFInitService } from "./service.init";
import { parseStringPromise } from "xml2js";

export class ONVIFEventService {
    private InitService: ONVIFInitService;

    constructor(InitService: ONVIFInitService) {
        this.InitService = InitService;
    }

    async GetEventProperties() {
        const soapBody = `
            <s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope">
                <s:Body>
                    <GetEventProperties xmlns="http://www.onvif.org/ver10/events/wsdl"/>
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
                return parseResponse;
            } catch (error) {
                console.error(`Failed To Fetch From ${URI}`, error);
                throw error;
            }
        };

        const dahuaURI = `http://${this.InitService.GetDeviceAddress()}/onvif/events_service`;
        const hikvisionURI = `http://${this.InitService.GetDeviceAddress()}/onvif/Events`;

        try {
            return await fetchUri(dahuaURI);
        } catch (error) {
            console.log("Fetch Hikvision URI...");
            return await fetchUri(hikvisionURI);
        }
    }
}