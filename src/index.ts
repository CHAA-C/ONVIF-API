import express from 'express';
import InitRouter from './ROUTE/route.init';
import MediaRouter from './ROUTE/route.media';
import DiscoverRouter from './ROUTE/route.discover';
import RecordRouter from './ROUTE/route.record';
import SearchRouter from './ROUTE/route.search';
import ReplayRouter from './ROUTE/route.replay';
import PTZRouter from './ROUTE/route.ptz';
import DeviceRouter from './ROUTE/route.device';
import EventRouter from './ROUTE/route.event';

const index = express();

index.use(express.json());
index.use("/api/onvif", InitRouter, DiscoverRouter);
index.use("/api/onvif/media", MediaRouter);
index.use("/api/onvif/record", RecordRouter);
index.use("/api/onvif/search", SearchRouter);
index.use("/api/onvif/replay", ReplayRouter);
index.use("/api/onvif/ptz", PTZRouter);
index.use("/api/onvif/device", DeviceRouter);
index.use("/api/onvif/event", EventRouter);

export default index;