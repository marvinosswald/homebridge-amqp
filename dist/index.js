"use strict";
require("source-map-support/register");
const AMQPConnector_1 = require("./AMQPConnector");
let homebridge;
module.exports = (api) => {
    homebridge = api;
    global.Service = homebridge.Service;
    global.Characteristic = homebridge.Characteristic;
    homebridge.registerAccessory("homebridge-amqp", "AMQP", AMQPConnector_1.default);
};
//# sourceMappingURL=index.js.map