"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const callback_api_1 = require("amqplib/callback_api");
class AMQPConnector {
    constructor(log, config) {
        this.log = log;
        // URLs
        this.connectionString = config["connection"] || false;
        this.queue = config["queue"];
        // General
        this.name = config["name"];
    }
    getServices() {
        let informationService = new Service.AccessoryInformation();
        informationService
            .setCharacteristic(Characteristic.Manufacturer, "AMQP Connector Manufacturer")
            .setCharacteristic(Characteristic.Model, "AMQP Connector")
            .setCharacteristic(Characteristic.SerialNumber, "de.marvinosswald.AMQPConnector");
        this.switchService = new Service.Switch();
        this.switchService
            .getCharacteristic(Characteristic.On)
            .on("get", this.getPowerState.bind(this))
            .on("set", this.setPowerState.bind(this));
        return [this.switchService];
    }
    getPowerState(callback) {
        return this.powerState;
        this.log(`[${this.name}] AMQP power state get function succeeded!`);
    }
    setPowerState(powerOn, callback) {
        this.update("powerState", powerOn ? 1 : 0, callback);
    }
    update(method, value, callback) {
        this.amqpSend('update ' + this.name + ' ' + method + ' ' + value);
        this.powerState = value;
        this.log(`[${this.name}] AMQP power state set function succeeded!`);
    }
    amqpSend(message) {
        callback_api_1.default.connect(this.connectionString, (err, conn) => {
            conn.createChannel((err, ch) => {
                var q = this.queue;
                var msg = message;
                ch.assertQueue(q, { durable: false });
                ch.sendToQueue(q, new Buffer(msg));
            });
            setTimeout(function () { conn.close(); }, 200);
        });
    }
}
exports.default = AMQPConnector;
//# sourceMappingURL=AMQPConnector.js.map