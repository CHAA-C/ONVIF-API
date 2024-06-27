import { ONVIFInitService } from "./service.init";
import { parseStringPromise } from "xml2js";

export class ONVIFRecordService {
    private InitService: ONVIFInitService;

    constructor(InitService: ONVIFInitService) {
        this.InitService = InitService;
    }

    async GetRecordings() {
        const soapBody = `
            <s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope">
                <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
                    <GetRecordings xmlns="http://www.onvif.org/ver10/recording/wsdl"/>
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
                    console.log(response.body);
                    throw new Error(`HTTP Error Status: ${response.status}`);
                }
                const responseText = await response.text();
                const parseResponse = await parseStringPromise(responseText);

                try {
                    const recording = parseResponse['s:Envelope']['s:Body'][0]['trc:GetRecordingsResponse'][0]['trc:RecordingItem'];
                    return recording.map((record: any) => ({
                        recordingToken: record['tt:RecordingToken'][0],
                        name: record['tt:Configuration'][0]['tt:Source'][0]['tt:Name'][0],
                    }));
                } catch (error) {
                    try {
                        const recording = parseResponse['env:Envelope']['env:Body'][0]['trc:GetRecordingsResponse'][0]['trc:RecordingItem'];
                        return recording.map((record: any) => ({
                            recordingToken: record['tt:RecordingToken'][0],
                            name: record['tt:Configuration'][0]['tt:Source'][0]['tt:Name'][0],
                        }));
                    } catch (error) {
                        try {
                            const recording = parseResponse['soap:Envelope']['soap:Body'][0]['trec:GetRecordingsResponse'][0]['trec:RecordingItem'];
                            return recording.map((record: any) => ({
                                recordingToken: record['tt:RecordingToken'][0],
                                name: record['tt:Configuration'][0]['tt:Source'][0]['tt:Name'][0],
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

        const DahauURI = `http://${this.InitService.GetDeviceAddress()}/onvif/recording_service`;
        const HikvisionURI = `http://${this.InitService.GetDeviceAddress()}/onvif/Recording`;

        try {
            return await fetchUri(DahauURI);
        } catch (error) {
            console.log("Fetch Hikvision URI...");
            return await fetchUri(HikvisionURI);
        }
    }

    private async GetRecordingJobs() {
        const soapBody = `
            <s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope">
                <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
                    <GetRecordingJobs xmlns="http://www.onvif.org/ver10/recording/wsdl"/>
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
                    const recordingJobs = parseResponse['s:Envelope']['s:Body'][0]['trc:GetRecordingJobsResponse'][0]['trc:JobItem'];
                    return recordingJobs.map((recordJob: any) => ({
                        jobToken: recordJob['tt:JobToken'][0],
                        mode: recordJob['tt:JobConfiguration'][0]['tt:Mode'][0],
                        recordingToken: recordJob['tt:JobConfiguration'][0]['tt:RecordingToken'][0]
                    }));
                } catch (error) {
                    try {
                        const recordingJobs = parseResponse['env:Envelope']['env:Body'][0]['trc:GetRecordingJobsResponse'][0]['trc:JobItem'];
                        return recordingJobs.map((recordJob: any) => ({
                            jobToken: recordJob['tt:JobToken'][0],
                            mode: recordJob['tt:JobConfiguration'][0]['tt:Mode'][0],
                            recordingToken: recordJob['tt:JobConfiguration'][0]['tt:RecordingToken'][0]
                        }));
                    } catch (error) {
                        try {
                            const recordingJobs = parseResponse['soap:Envelope']['soap:Body'][0]['trec:GetRecordingJobsResponse'][0]['trec:JobItem'];
                            return recordingJobs.map((recordJob: any) => ({
                                jobToken: recordJob['tt:JobToken'][0],
                                mode: recordJob['tt:JobConfiguration'][0]['tt:Mode'][0],
                                recordingToken: recordJob['tt:JobConfiguration'][0]['tt:RecordingToken'][0]
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

        const DahauURI = `http://${this.InitService.GetDeviceAddress()}/onvif/recording_service`;
        const HikvisionURI = `http://${this.InitService.GetDeviceAddress()}/onvif/Recording`;

        try {
            return await fetchUri(DahauURI);
        } catch (error) {
            console.log("Fetch Hikvision URI...");
            return await fetchUri(HikvisionURI);
        }
    }

    async GetServiceCapabilities() {
        const soapBody = `
            <s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope">
                <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
                    <GetServiceCapabilities xmlns="http://www.onvif.org/ver10/recording/wsdl"/>
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
                    return parseResponse['s:Envelope']['s:Body'][0]['trc:GetServiceCapabilitiesResponse'][0]['trc:Capabilities'];
                } catch (error) {
                    try {
                        return parseResponse['env:Envelope']['env:Body'][0]['trc:GetServiceCapabilitiesResponse'][0]['trc:Capabilities'];
                    } catch (error) {
                        try {
                            return parseResponse['soap:Envelope']['soap:Body'][0]['trec:GetServiceCapabilitiesResponse'][0]['trec:Capabilities'];
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

        const DahauURI = `http://${this.InitService.GetDeviceAddress()}/onvif/recording_service`;
        const HikvisionURI = `http://${this.InitService.GetDeviceAddress()}/onvif/Recording`;

        try {
            return await fetchUri(DahauURI);
        } catch (error) {
            console.log("Fetch Hikvision URI...");
            return await fetchUri(HikvisionURI);
        }
    }

    async GetRecordingMode() {
        try {
            const recording = await this.GetRecordings();
            const recordingJobs = await this.GetRecordingJobs();

            const mergeData = recording.map((recording: { recordingToken: any; name: any }) => {
                const recordJobs = recordingJobs.find((recordJobs: { recordingToken: any; }) => recordJobs.recordingToken === recording.recordingToken);
                return {
                    recordingToken: recording.recordingToken,
                    name: recording.name,
                    jobToken: recordJobs ? recordJobs.jobToken : null,
                    mode: recordJobs ? recordJobs.mode : null,
                };
            });

            return { RecordingMode: mergeData };
        } catch (error) {
            console.error('Failed To Fetch Recording Status...', error);
            throw error;
        }
    }
}