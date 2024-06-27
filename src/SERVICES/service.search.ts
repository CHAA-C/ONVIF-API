import { ONVIFInitService } from "./service.init";
import { ONVIFRecordService } from "./service.record";
import { parseStringPromise } from "xml2js";

export class ONVIFSearchService {
    private InitService: ONVIFInitService;
    private RecordService: ONVIFRecordService;

    constructor(InitService: ONVIFInitService) {
        this.InitService = InitService;
        this.RecordService = new ONVIFRecordService(InitService);
    }

    private converionToGMT(UTCTime: string, Plus: number): string {
        const date = new Date(UTCTime);
        date.setHours(date.getHours() + Plus);
        return date.toISOString();
    }

    private async GetRecordingInformation(recordingToken: string) {
        const soapBody = `
            <s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope">
                <s:Body>
                    <GetRecordingInformation xmlns="http://www.onvif.org/ver10/search/wsdl">
                        <RecordingToken>${recordingToken}</RecordingToken>
                    </GetRecordingInformation>
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

                const Plus = 7;

                try {
                    const recordingInformation = parseResponse['s:Envelope']['s:Body'][0]['tse:GetRecordingInformationResponse'][0]['tse:RecordingInformation'][0];
                    return {
                        recordingToken: recordingInformation['tt:RecordingToken'][0],
                        name: recordingInformation['tt:Source'][0]['tt:Name'][0],
                        earliestRecording: this.converionToGMT(recordingInformation['tt:EarliestRecording'][0], Plus),
                        latestRecording: this.converionToGMT(recordingInformation['tt:LatestRecording'][0], Plus),
                        recordingStatus: recordingInformation['tt:RecordingStatus'][0],
                    };
                } catch (error) {
                    try {
                        const recordingInformation = parseResponse['env:Envelope']['env:Body'][0]['tse:GetRecordingInformationResponse'][0]['tse:RecordingInformation'][0];
                        return {
                            recordingToken: recordingInformation['tt:RecordingToken'][0],
                            name: recordingInformation['tt:Source'][0]['tt:Name'][0],
                            earliestRecording: this.converionToGMT(recordingInformation['tt:EarliestRecording'][0], Plus),
                            latestRecording: this.converionToGMT(recordingInformation['tt:LatestRecording'][0], Plus),
                            recordingStatus: recordingInformation['tt:RecordingStatus'][0],
                        };
                    } catch (error) {
                        try {
                            const recordingInformation = parseResponse['soap:Envelope']['soap:Body'][0]['trsrch:GetRecordingInformationResponse'][0]['trsrch:RecordingInformation'][0];
                            return {
                                recordingToken: recordingInformation['tt:RecordingToken'][0],
                                name: recordingInformation['tt:Source'][0]['tt:Name'][0],
                                earliestRecording: this.converionToGMT(recordingInformation['tt:EarliestRecording'][0], Plus),
                                latestRecording: this.converionToGMT(recordingInformation['tt:LatestRecording'][0], Plus),
                                recordingStatus: recordingInformation['tt:RecordingStatus'][0],
                            };
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

        const DahauURI = `http://${this.InitService.GetDeviceAddress()}/onvif/search_service`;
        const HikvisionURI = `http://${this.InitService.GetDeviceAddress()}/onvif/SearchRecording`;

        try {
            return await fetchUri(DahauURI);
        } catch (error) {
            console.log("Fetch Hikvision URI...");
            return await fetchUri(HikvisionURI);
        }
    }

    async GetRecordingStatus() {
        try {
            const recording = await this.RecordService.GetRecordings();
            const recordingModePromises = recording.map((recordingToken: { recordingToken: string; }) =>
                this.GetRecordingInformation(recordingToken.recordingToken)
            );

            const recordingInformation = await Promise.all(recordingModePromises);

            const mergeData = recording.map((status: any) => {
                const informations = recordingInformation.find(informations => informations.recordingToken === status.recordingToken);
                return {
                    recordingToken: status.recordingToken,
                    name: status.name,
                    earliestRecording: informations ? informations.earliestRecording : null,
                    latestRecording: informations ? informations.latestRecording : null,
                    recordingStatus: informations ? informations.recordingStatus : null,
                };
            });

            return { RecordingInformation: mergeData };
        } catch (error) {
            console.error('Failed To Fetch Merged Recording Information...', error);
            throw error;
        }
    }
};