import { OnvifServiceBase, OnvifServiceBaseConfigs } from './service-base';
export declare class OnvifServiceEvents extends OnvifServiceBase {
    constructor(configs: OnvifServiceEventsConfigs);
    getEventProperties(): Promise<import("./soap").Result>;
}
export interface OnvifServiceEventsConfigs extends OnvifServiceBaseConfigs {
    timeDiff: number;
}
