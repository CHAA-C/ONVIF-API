import { ONVIFInitService } from "./service.init";
import { writeFileSync } from 'fs';
import { parseStringPromise } from "xml2js";
import path from "path";

export class ONVIFMediaService {
    private InitService: ONVIFInitService;

    constructor(InitService: ONVIFInitService) {
        this.InitService = InitService;
    }

    async GetProfileTokens() {
        const soapBody = `
            <s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope">
                <s:Body>
                    <GetProfiles xmlns="http://www.onvif.org/ver10/media/wsdl"/>
                </s:Body>
            </s:Envelope>
        `;

        try {
            const response = await this.InitService.GetDigestClient().fetch(
                `http://${this.InitService.GetDeviceAddress()}/onvif/media_service`,
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
            const responseText = await response.text();
            const parseResponse = await parseStringPromise(responseText);

            try {
                const profilesToken = parseResponse['s:Envelope']['s:Body'][0]['trt:GetProfilesResponse'][0]['trt:Profiles'];
                return profilesToken.map((profile: any) => ({
                    name: profile['tt:Name'][0],
                    token: profile['$']['token'],
                }));
            } catch (error) {
                try {
                    const profilesToken = parseResponse['env:Envelope']['env:Body'][0]['trt:GetProfilesResponse'][0]['trt:Profiles'];
                    return profilesToken.map((profile: any) => ({
                        name: profile['tt:Name'][0],
                        token: profile['$']['token'],
                    }));
                } catch (error) {
                    try {
                        const profilesToken = parseResponse['soap:Envelope']['soap:Body'][0]['trt:GetProfilesResponse'][0]['trt:Profiles'];
                        return profilesToken.map((profile: any) => ({
                            name: profile['tt:Name'][0],
                            token: profile['$']['token'],
                        }));
                    } catch (error) {
                        throw new Error('Failed To Parse The Response Using Both Dahua And Hikvision Formats.');
                    }
                }
            }
        } catch (error) {
            console.error('Failed To Fetch A Device Profile Tokens...', error);
            throw error;
        }
    }

    private async GetStreamURI(ProfileToken: string) {
        const soapBody = `
            <s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope">
                <s:Body>
                    <GetStreamUri xmlns="http://www.onvif.org/ver10/media/wsdl">
                        <StreamSetup>
                            <Stream xmlns="http://www.onvif.org/ver10/schema">RTP-Unicast</Stream>
                            <Transport xmlns="http://www.onvif.org/ver10/schema">
                                <Protocol>RTSP</Protocol>
                            </Transport>
                        </StreamSetup>
                        <ProfileToken>${ProfileToken}</ProfileToken>
                    </GetStreamUri>
                </s:Body>
            </s:Envelope>
        `;

        try {
            const response = await this.InitService.GetDigestClient().fetch(
                `http://${this.InitService.GetDeviceAddress()}/onvif/media_service`,
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
            const responseText = await response.text();
            const parseResponse = await parseStringPromise(responseText);

            try {
                return parseResponse['s:Envelope']['s:Body'][0]['trt:GetStreamUriResponse'][0]['trt:MediaUri'][0]['tt:Uri'][0];
            } catch (error) {
                try {
                    return parseResponse['env:Envelope']['env:Body'][0]['trt:GetStreamUriResponse'][0]['trt:MediaUri'][0]['tt:Uri'][0];
                } catch (error) {
                    try {
                        return parseResponse['soap:Envelope']['soap:Body'][0]['trt:GetStreamUriResponse'][0]['trt:MediaUri'][0]['tt:Uri'][0];
                    } catch (error) {
                        throw new Error('Failed To Parse The Response Using Both Dahua And Hikvision Formats.');
                    }
                }
            }
        } catch (error) {
            console.error('Failed To Fetch A Device Stream URI...', error);
            throw error;
        }
    }

    async GetAllStreamURIs() {
        try {
            const profileTokens = await this.GetProfileTokens();
            const username = this.InitService.GetDeviceUsername();
            const password = this.InitService.GetDevicePassword();
            const streamURIs = await Promise.all(profileTokens.map(async (profile: { token: string; name: string }) => {
                let URIs = await this.GetStreamURI(profile.token);
                URIs = URIs.replace('://', `://${username}:${password}@`)
                return {
                    name: profile.name,
                    token: profile.token,
                    uri: URIs
                };
            }));
            return streamURIs;
        } catch (error) {
            console.error('Failed To Fetch All Stream URIs...', error);
            throw error;
        }
    }

    private async GetSnapshotURI(ProfileToken: string) {
        const soapBody = `
            <s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope">
                <s:Body>
                    <GetSnapshotUri xmlns="http://www.onvif.org/ver10/media/wsdl">
                        <ProfileToken>${ProfileToken}</ProfileToken>
                    </GetSnapshotUri>
                </s:Body>
            </s:Envelope>
        `;

        try {
            const response = await this.InitService.GetDigestClient().fetch(
                `http://${this.InitService.GetDeviceAddress()}/onvif/media_service`,
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
            const responseText = await response.text();
            const parseResponse = await parseStringPromise(responseText);

            try {
                return parseResponse['s:Envelope']['s:Body'][0]['trt:GetSnapshotUriResponse'][0]['trt:MediaUri'][0]['tt:Uri'][0];
            } catch (error) {
                try {
                    return parseResponse['env:Envelope']['env:Body'][0]['trt:GetSnapshotUriResponse'][0]['trt:MediaUri'][0]['tt:Uri'][0];
                } catch (error) {
                    try {
                        return parseResponse['soap:Envelope']['soap:Body'][0]['trt:GetSnapshotUriResponse'][0]['trt:MediaUri'][0]['tt:Uri'][0];
                    } catch (error) {
                        throw new Error('Failed To Parse The Response Using Both Dahua And Hikvision Formats.');
                    }
                }
            }
        } catch (error) {
            console.error('Failed To Fetch A Device Snapshot URI...', error);
            throw error;
        }
    }

    async GetAllSnapshotURIs() {
        try {
            const profileTokens = await this.GetProfileTokens();
            const streamURIs = await Promise.all(profileTokens.map(async (profile: { token: string; name: string }) => {
                const URIs = await this.GetSnapshotURI(profile.token);
                return {
                    name: profile.name,
                    token: profile.token,
                    uri: URIs
                };
            }));
            return streamURIs;
        } catch (error) {
            console.error('Failed To Fetch All Snapshot URIs...', error);
            throw error;
        }
    }

    async DownloadSnapshot(profileName: string) {
        try {
            const snapshotURIs = await this.GetAllSnapshotURIs();
            const snapshotURI = snapshotURIs.find(uri => uri.name === profileName)?.uri;
            if (!snapshotURI) {
                throw new Error(`Failed To Find Snapshot URI For Profile: ${profileName}`);
            }

            const response = await this.InitService.GetDigestClient().fetch(snapshotURI);
            if (!response.ok) {
                throw new Error(`Failed To Download Snapshot For Profile: ${profileName}`);
            }

            const buffer = await response.arrayBuffer();
            const outputPath = path.join('./SNAPSHOT', `${profileName}_snapshot.jpg`);
            writeFileSync(outputPath, Buffer.from(buffer));

            console.log(`Snapshot Saved To ${outputPath}`)
        } catch (error) {
            console.error('Failed To Download Snapshot...', error);
            throw error;
        }
    }
};
