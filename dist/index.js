"use strict";
const AMQPConnector_1 = require("./AMQPConnector");
module.exports = (homebridge) => {
    const hap = homebridge.hap;
    global.HapService = hap.Service;
    global.HapCharacteristic = hap.Characteristic;
    homebridge.registerAccessory('homebridge-amqp', 'AMQP', AMQPConnector_1.default);
};
//# sourceMappingURL=index.js.map