# ONVIF-API
 
![ONVIF](https://img.shields.io/badge/ONVIF-API-blue.svg)

## Overview

ONVIF-API is my intern project desighned to use an ONVIF Protocol with IP camera and NVR (Network Video Record) by using REST API. Currently test on Dahua and Hikvison. My API is use some funvtion from "https://github.com/YoshieraHuang/node-onvif-ts"
## Features

- **DISCOVERY DEVICE**: Discovery ONVIF device by give your desire start IP address and it will search a ONVIF devices. 
- **GET USERS**: Retrieve ONVIF users from device.
- **GET STREAM URIs**: Retrieve all stream uris that aviable on ONVIF device.
- **GET SNAPSHOT AND DONWLOAD**: Take a snapshot from your given profile name of ONVIF devices and download to your computer.
- **GET RECORDING STATUS**: Retrieve all recording status that aviable on ONVIF device.
- **GET REPLAY URIs**: Retrieve all replay stream uris that aviable on ONVIF device.
- **GET EVENT PROPERTIES**: Retrieve all event that support for each ONVIF device.
- **PTZ CONTROL**: Control your ONVIF devices that support PTZ control.

## Usage
Tested on Postman

- **DISCOVER DEVICE**
- Method: POST
- URL: http://localhost:3000/api/onvif/discoverDevice
- Body:   - "START_IP_ADDRESS" : "10.54.x.0"

- **GET USERS**
Method: POST
URL: http://localhost:3000/api/onvif/device/getUsers
Body:   "addr" : "10.54.x.0",
        "user" : "xxxxx", (admin user role only)
        "pass" : "xxxxx",

- **GET PROFILE TOKEN**
Method: POST
URL: http://localhost:3000/api/onvif/media/getProfileTokens
Body:   "addr" : "10.54.x.0",
        "user" : "xxxxx",
        "pass" : "xxxxx",

- **GET STREAM URIs**
Method: POST
URL: http://localhost:3000/api/onvif/media/getStreamURIs
Body:   "addr" : "10.54.x.0",
        "user" : "xxxxx",
        "pass" : "xxxxx",

- **DOWNLOAD SNAPSHOT**
Method: POST
URL: http://localhost:3000/api/onvif/media/downloadSnapshot
Body:   "addr" : "10.54.x.0",
        "user" : "xxxxx",
        "pass" : "xxxxx",
        "profileName" : "xxxxx",

- **GET RECORD STATUS**
Method: POST
URL: http://localhost:3000/api/onvif/search/getRecordingInformation
Body:   "addr" : "10.54.x.0",
        "user" : "xxxxx",
        "pass" : "xxxxx",

- **GET REPLAY URIs**
Method: POST \n
URL: http://localhost:3000/api/onvif/replay/getReplayURI
Body:   "addr" : "10.54.x.0",
        "user" : "xxxxx",
        "pass" : "xxxxx",
        "starttime" : "YY_MM_DD_HH_MM_SS",
        "endtime" : "YY_MM_DD_HH_MM_SS",

- **GET EVENT PROPERTIES**
Method: POST
URL: http://localhost:3000/api/onvif/event/eventProperties
Body:   "addr" : "10.54.x.0",
        "user" : "xxxxx",
        "pass" : "xxxxx",

- **PTZ CONTROL**
Method: POST
URL: http://localhost:3000/api/onvif/ptz/ptzControl
Body:   "addr" : "10.54.x.0",
        "user" : "xxxxx",
        "pass" : "xxxxx",
        "speed" : {
            "x" : 0.0,
            "y" : 0.0,
            "z" : 0.0
        },
        "profileToken" : xxxxx



