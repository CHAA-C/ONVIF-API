import { ONVIFInitService } from "./service.init";
import { ONVIFRecordService } from "./service.record";
import { ONVIFMediaService } from "./service.media";
import { parseStringPromise } from "xml2js";

export class ONVIFReplayService {
    private InitService: ONVIFInitService;
    private RecordService: ONVIFRecordService;
    private MediaService: ONVIFMediaService;
    private profileMap: Map<string, string>;

    constructor(InitService: ONVIFInitService) {
        this.InitService = InitService;
        this.RecordService = new ONVIFRecordService(InitService);
        this.MediaService = new ONVIFMediaService(InitService);
        this.profileMap = new Map();
    }

    private async IsDahuaDevice(replayURI: string): Promise<boolean> {
        return replayURI.includes("dahua") || replayURI.includes("token")
    }

    private async InitProfileMap() {
        const profiles = await this.MediaService.GetProfileTokens();
        profiles.forEach((profile: { token: string; name: string; }) => {
            this.profileMap.set(profile.token, profile.name);
        });
    }

    private GetChannelFromProfile(profileName: string): string {
        const match = profileName.match(/Channel(\d+)/);
        if (match) {
            return match[1];
        }
        throw new Error('Channel not found in profile name.');
    }

    private async FormatIsoTime(selectedTime: string): Promise<string> {
        const parts = selectedTime.split('_');
        return `${parts[0]}${parts[1]}${parts[2]}T${parts[3]}${parts[4]}${parts[5]}Z`;
    }

    private async GetReplayURI(recordingToken: string) {
        const soapBody = `
            <s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope">
                <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
                    <GetReplayUri xmlns="http://www.onvif.org/ver10/replay/wsdl">
                        <StreamSetup>
                            <Stream xmlns="http://www.onvif.org/ver10/schema">RTP-Unicast</Stream>
                            <Transport xmlns="http://www.onvif.org/ver10/schema">
                                <Protocol>RTSP</Protocol>
                            </Transport>
                        </StreamSetup>
                        <RecordingToken>${recordingToken}</RecordingToken>
                    </GetReplayUri>
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
                    throw new Error(`HTTP Error Status: ${response.status}`);
                }
                const responseText = await response.text();
                const parseResponse = await parseStringPromise(responseText);

                try {
                    const recordURI = parseResponse['s:Envelope']['s:Body'][0]['trp:GetReplayUriResponse'][0]['trp:Uri'][0];
                    return recordURI;
                } catch (error) {
                    try {
                        const recordURI = parseResponse['env:Envelope']['env:Body'][0]['trp:GetReplayUriResponse'][0]['trp:Uri'];
                        return recordURI;
                    } catch (error) {
                        try {
                            const recordURI = parseResponse['soap:Envelope']['soap:Body'][0]['treplay:GetReplayUriResponse'][0]['treplay:Uri'];
                            return recordURI;
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

        const DahuaURI = `http://${this.InitService.GetDeviceAddress()}/onvif/replay_service`;
        const HikvisionURI = `http://${this.InitService.GetDeviceAddress()}/onvif/Replay`;

        try {
            return await fetchUri(DahuaURI);
        } catch (error) {
            console.log("Fetch Hikvision URI...");
            return await fetchUri(HikvisionURI);
        }
    }

    async GetAllReplayURIs(startTime: string, endTime: string) {
        try {
            await this.InitProfileMap();
            const recordings = await this.RecordService.GetRecordings();
            const username = this.InitService.GetDeviceUsername();
            const password = this.InitService.GetDevicePassword();
            const replayURIPromises = recordings.map(async (recording: { recordingToken: string, name: string }) => {
                let replayURI = await this.GetReplayURI(recording.recordingToken);
                const profileToken = recording.recordingToken.replace('RecordMediaProfile', 'MediaProfile');
                const profileName = this.profileMap.get(profileToken);
                if (!profileName) {
                    throw new Error(`Profile Name Not Found For Token ${profileToken}`);
                }
                const channel = this.GetChannelFromProfile(profileName);
                const url = new URL(replayURI);
                url.username = username;
                url.password = password;

                if (await this.IsDahuaDevice(replayURI)) {
                    url.searchParams.delete('token');
                    url.searchParams.set('channel', channel);
                    url.searchParams.set('proto', 'Onvif');
                    url.searchParams.append('starttime', startTime);
                    url.searchParams.append('endtime', endTime);
                } else {
                    url.searchParams.set('starttime', await this.FormatIsoTime(startTime));
                    url.searchParams.set('endtime', await this.FormatIsoTime(endTime));
                }

                replayURI = url.toString().replace(url.origin, `${url.protocol}//${username}:${password}@${url.hostname}`);
                return {
                    recordingToken: recording.recordingToken,
                    name: recording.name,
                    replayURI
                };
            });

            const replayURIs = await Promise.all(replayURIPromises);

            return { ReplayURIs: replayURIs };
        } catch (error) {
            console.error('Failed To Fetch All Replay URIs...', error);
            throw error;
        }
    }
};
